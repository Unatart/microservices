import {CommonControllers} from "../../common/commonControllers";
import {AuthDBManager} from "../dbManager/authDBManager";
import {Request, Response} from "express";
import {createError} from "../../common/commonError";

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
                if (status === "created") {
                    const session_response = await fetch("http://localhost:3007/token", {
                        method: "post",
                        body: JSON.stringify({
                            user_id: avail_user.user_id
                        }),
                        headers: {'Content-Type': 'application/json'}
                    }).catch(() => {
                        return res.status(503).send();
                    });

                    const session = session_response.json();

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
                    const session_response = await fetch("http://localhost:3007/token", {
                        method: "patch",
                        body: JSON.stringify({
                            user_id: avail_user.user_id
                        }),
                        headers: {'Content-Type': 'application/json'}
                    }).catch(() => {
                        return res.status(503).send();
                    });

                    const session = session_response.json();

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
                res
                    .status(400)
                    .send(createError('Invalid password'));
            }
        } catch (error) {
            res
                .status(400)
                .send(createError(error.message));
        }

        return res;
    };

    /**
     * должен содержать хотя бы одну цифру,
     * хотя бы одну строчную лат. букву,
     * хотя бы одну прописную лат. букву,
     * и быть размером не меньше 8 символов
     */
    private password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
}