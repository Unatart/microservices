import {winston_logger} from "../winston/winstonLogger";
import {Request, Response, NextFunction} from "express";

export class CommonMiddleware {
    constructor(init_name:string) {
        this.name = init_name;
    }

    public innerMiddleware() {
        const self = this;
        return async function(req:Request, res:Response, next:NextFunction) {
            winston_logger.info("COMMON_MIDDLEWARE: " + self.name);
            if (req.body.key === process.env.KEY && req.body.secret === process.env.SECRET) {
                if (req.body.token) {
                    return await fetch("http://localhost:3007/token/" + req.body.token, {
                        method: "get",
                        body: JSON.stringify({
                            service_name: self.name
                        }),
                        headers: {'Content-Type': 'application/json'}
                    }).then((response) => {
                        if (response.status === 200) {
                            return next;
                        }
                        if (response.status > 400) {
                            // TODO: update
                        }
                    });
                } else {
                    return await fetch("http://localhost:3007/token/" + self.name, {
                        method: "post",
                        headers: {'Content-Type': 'application/json'}
                    }).then((result) => result.json())
                        .then((data) => res.status(449).send(data.token));
                }
            } else {
                return res.status(401).send();
            }
        }
    }

    public outerMiddleware() {
        const self = this;
        return async function(req:Request, res:Response, next:NextFunction) {
            winston_logger.info("COMMON_MIDDLEWARE: " + self.name);
            // TODO: токен будет в хэдере
            if (req.params.token && req.params.user_id) {
                return await fetch("http://localhost:3007/token", {
                    method: "get",
                    body: JSON.stringify({
                        user_id: req.params.user_id,
                        token: req.params.token
                    }),
                    headers: {'Content-Type': 'application/json'}
                }).then(() => next());
            } else {
                return res.status(401).send();
            }
        }
    }

    private name:string;
}