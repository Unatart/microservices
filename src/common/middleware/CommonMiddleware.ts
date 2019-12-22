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
            if (req.query.key === process.env.KEY && req.query.secret === process.env.SECRET) {
                if (req.query.token && req.query.token !== "undefined") {
                    const result = await fetch("http://localhost:3007/token/" + req.query.token + "/service/" + self.name, {
                        method: "get",
                        headers: {'Content-Type': 'application/json'},
                    });

                    if (result.status === 200) {
                        next();
                    } else {
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
                return res.sendStatus(401).end();
            }
        }
    }

    public outerMiddleware() {
        const self = this;
        return async function(req:Request, res:Response, next:NextFunction) {
            winston_logger.info("COMMON_MIDDLEWARE: " + self.name);
            if (/<(.*?)>/.exec(req.header('authorization'))[1] && req.params.id) {
                console.log('check token...');
                return await fetch("http://localhost:3007/user/"+req.params.id+"/token/"+req.params.token, {
                    method: "get",
                    headers: {'Content-Type': 'application/json'}
                }).then(() => next());
            } else {
                return res.status(401).send();
            }
        }
    }

    private name:string;
}