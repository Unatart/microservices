import {CommonControllers} from "../../common/commonControllers";
import {AuthDBManager} from "../dbManager/authDBManager";
import {Request, Response} from "express";
import {createError} from "../../common/commonError";
import * as fetch from "node-fetch";

export class AuthControllers extends CommonControllers<AuthDBManager> {
    public connectUser = async (req: Request, res: Response) => {
        try {
            const name = req.body["name"];
            const password = req.body["password"];
            if (this.password_regex.test(password) && name) {
                const result = await this.db_manager.auth(name, password);
                let avail_user;
                let status;
                [avail_user, status] = [...result];
                console.log(status, avail_user);
                if (status === "create") {
                    const session_response = await fetch("http://localhost:3007/user/" + avail_user.user_id + "/token", {
                        method: "post",
                        headers: {'Content-Type': 'application/json'},
                    }).catch(() => {
                        return res.status(503).send();
                    });

                    const session = await session_response.json();

                    if (session_response.status > 400) {

                        return res
                            .status(+session_response.status)
                            .send(session);
                    }

                    return res
                        .status(200)
                        .send({
                            user: avail_user,
                            session: session
                        })
                } else {
                    const session_response = await fetch("http://localhost:3007/user/" + avail_user.user_id + "/token", {
                        method: "patch",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            user_id: avail_user.user_id
                        }),
                    }).catch(() => {
                        return res.status(503).send();
                    });

                    const session = await session_response.json();

                    if (session_response.status > 400) {
                        return res
                            .status(+session_response.status)
                            .send(session);
                    }

                    return res
                        .status(200)
                        .send({
                            user: avail_user,
                            session: session
                        })
                }
            } else {
                return res
                    .status(400)
                    .send(createError('Invalid password'));
            }
        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    };

    public createCode = async (req: Request, res: Response) => {
        const client_id = req.query.client_id;
        const client_secret = req.query.client_secret;
        const user_id = req.query.user_id;

        const response = await fetch("http://localhost:3007/code/?client_id="+client_id +"&client_secret="+client_secret+"&user_id="+user_id, {
            method:"post",
            headers: {'Content-Type': 'application/json'}
        });

        const body = await response.json();

        return res
            .status(response.status)
            .send(body)
    };

    public getToken = async (req: Request, res: Response) => {
        try {
            const client_id = req.query.client_id;
            const client_secret = req.query.client_secret;
            const grant_type = req.query.grant_type;

            if (grant_type === "auth_code") {
                const code = req.query.code;
                const response = await fetch("http://localhost:3007/code/" + code + "/?client_id=" + client_id + "&client_secret=" + client_secret, {
                    method: "post",
                    headers: {'Content-Type': 'application/json'}
                });

                const body = await response.json();

                return res
                    .status(response.status)
                    .send(body)
            }

            if (grant_type === "refresh_token") {
                const refresh_token = req.query.refresh_token;
                const response = await fetch("http://localhost:3007/refresh_token/" + refresh_token + "?client_id=" + client_id + "&client_secret=" + client_secret, {
                    method: "post",
                    headers: {'Content-Type': 'application/json'}
                });

                const body = await response.json();

                return res
                    .status(response.status)
                    .send(body)
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    /**
     * должен содержать хотя бы одну цифру,
     * хотя бы одну строчную лат. букву,
     * хотя бы одну прописную лат. букву,
     * и быть размером не меньше 8 символов
     */
    private password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
}