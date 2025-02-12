import {winston_logger} from "../winston/winstonLogger";
import {Request, Response, NextFunction} from "express";
import * as fetch from "node-fetch";

export class CommonMiddleware {
    constructor(init_name:string) {
        this.name = init_name;
    }

    public innerMiddleware() {
        const self = this;
        return async function(req:Request, res:Response, next:NextFunction) {
            winston_logger.info("COMMON_MIDDLEWARE: " + self.name);
            console.log(req.query.key, req.query.secret, req.query.token);
            console.log(process.env.KEY, process.env.SECRET);
            if (req.query.key === process.env.KEY && req.query.secret === process.env.SECRET) {
                if (req.query.token && req.query.token !== "undefined") {
                    const result = await fetch("http://localhost:3007/token/" + req.query.token + "/service/" + self.name, {
                        method: "get",
                        headers: {'Content-Type': 'application/json'},
                    });

                    if (result.status === 200) {
                        return next();
                    } else {
                        console.log('expired token');
                        return res
                            .status(401)
                            .send(JSON.stringify({message: 'expired token'}));
                    }
                } else {
                    console.log(self);
                    const result = await fetch("http://localhost:3007/token/" + self.name, {
                        method: "post",
                        headers: {'Content-Type': 'application/json'}
                    });

                    const response = await result.json();
                    if (result.status === 201) {
                        return res.status(449).send(response)
                    }

                    return res.status(401).send();
                }
            } else {
                return res.sendStatus(401).send();
            }
        }
    }

    public outerMiddleware() {
        const self = this;
        return async function(req:Request, res:Response, next:NextFunction) {
            winston_logger.info("COMMON_MIDDLEWARE: " + self.name);
            const token = /<(.*?)>/.exec(req.header('authorization'))[1];
            if (token && req.params.id) {
                console.log('check token...', token);
                let response;
                if (req.query.app_id) {
                    console.log('for app...');
                    response = await fetch("http://localhost:3007/code/?user_id="+req.params.id+"&token="+token, {
                        method: "get",
                        headers: {'Content-Type': 'application/json'}
                    });
                } else {
                    console.log('for user...');
                    response = await fetch("http://localhost:3007/user/" + req.params.id + "/token/" + token, {
                        method: "get",
                        headers: {'Content-Type': 'application/json'}
                    });
                }

                console.log(response.status, await response.json());
                if (response.status === 200) {
                    return next();
                } else {
                    return res.sendStatus(401).send();
                }
            } else {
                return res.status(401).send();
            }
        }
    }

    private name:string;
}