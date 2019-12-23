import * as fetch from "node-fetch";
import * as RedisSMQ from "rsmq";
import {favsCirquitBreaker, storyCirquitBreaker} from "../../gateway/routes/gatewayRoutes";

class Queue {
    constructor(init_name:string, init_port:number) {
        this.name = init_name;
        this.rsmq = new RedisSMQ({host: "127.0.0.1", port: init_port, ns: "rsmq", realtime: true});
        this.rsmq.createQueue({ qname: this.name }, (err) => {
            if (err) {
                if (err.name !== "queueExists") {
                    console.error(err);
                    return;
                } else {
                    console.log("queue exists.. resuming..");
                }
            }
        });
    }

    public push(data:any) {
        this.rsmq.sendMessage({qname: this.name, message: JSON.stringify(data)}, (err, resp) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log("Message sent. ID:", resp);
        });
    }

    public pop() {
        const self = this;
        this.rsmq.popMessage({qname: this.name}, function (err, resp) {
            if (err) {
                console.error(err);
                return;
            }

            if (resp.id) {
                console.log("Message received and deleted from queue", resp);
                self.sendRequest(JSON.parse(resp.message));
            } else {
                console.log("No messages for me...");
            }
        })
    }

    private async sendRequest(data:any) {
        if (this.name === "favs") {
            let favs_token;
            const result = await this.sendReq(data, process.env.favs_key, process.env.favs_secret, favs_token)
                .catch(() => {
                    this.push({url: data.url, method: data.method});
                    favsCirquitBreaker.upTry();
                });

            const result_data = await result.json();
            favs_token = result_data.token;
            if (result.status === 449) {
                await this.sendReq(data, process.env.favs_key, process.env.favs_secret, favs_token).catch(() => {
                    this.push({url: data.url, method: data.method});
                    favsCirquitBreaker.upTry();
                });
            }

            if (result_data.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + favs_token + "/service/Favs", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                favs_token = body_refresh.token;
                await this.sendReq(data, process.env.favs_key, process.env.favs_secret, favs_token).catch(() => {
                    this.push({url: data.url, method: data.method});
                    favsCirquitBreaker.upTry();
                });
            }
        }

        if (this.name === "story") {
            let story_token;
            const result = await this.sendReq(data, process.env.story_key, process.env.story_secret, story_token).catch(() => {
                this.push({url: data.url, method: data.method});
                storyCirquitBreaker.upTry();
            });

            const result_data = await result.json();
            story_token = result_data.token;
            if (result.status === 449) {
                await this.sendReq(data, process.env.story_key, process.env.story_secret, story_token).catch(() => {
                    this.push({url: data.url, method: data.method});
                    storyCirquitBreaker.upTry();
                });
            }

            if (result_data.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                story_token = body_refresh.token;
                await this.sendReq(data, process.env.story_key, process.env.story_secret, story_token).catch(() => {
                    this.push({url: data.url, method: data.method});
                    storyCirquitBreaker.upTry();
                });
            }
        }
    }

    private sendReq(data, key, secret, token) {
        return fetch(data.url + "?key=" + key + "&secret=" + secret + "&token=" + token, {
            method: data.method,
            headers: {'Content-Type': 'application/json'}
        })
    }

    private rsmq;
    private name:string;
}

export const q_favs:Queue = new Queue('favs', 6379);
export const q_story:Queue = new Queue('story', 6380);