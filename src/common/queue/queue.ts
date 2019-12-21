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

    //TODO: then response === 449 => + token & send again
    private sendRequest(data:any):void {
        fetch(data.url, {
            method: data.method,
            headers: {'Content-Type': 'application/json'}
        }).catch(() => {
            this.push({url: data.url, method: data.method});
            if (this.name === "story") {
                storyCirquitBreaker.upTry();
            }
            if (this.name === "favs") {
                favsCirquitBreaker.upTry();
            }
        })
    }

    private rsmq;
    private name:string;
}

export const q_favs:Queue = new Queue('favs', 6379);
export const q_story:Queue = new Queue('story', 6380);