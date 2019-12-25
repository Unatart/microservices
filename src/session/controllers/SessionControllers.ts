import {CommonControllers} from "../../common/commonControllers";
import {SessionDBManager} from "../dbManager/SessionDBManager";
import {Request, Response} from "express";

export class SessionControllers extends CommonControllers<SessionDBManager> {
    public createTokenForUser = async (req:Request, res:Response) => {
        try {
            console.log(req.params.user_id);
            const result = await this.db_manager.createTokenForUser(req.params.user_id);

            res
                .status(201)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public createTokenForService = async (req:Request, res:Response) => {
        try {
            const result = await this.db_manager.createTokenForService(req.params.service_name);

            res
                .status(201)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public checkTokenForService = async (req:Request, res:Response) =>  {
        try {
            const token = req.params.token;
            const service_name = req.params.service_name;
            console.log(token, service_name);
            const result = await this.db_manager.checkToken(token, service_name);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public checkTokenForUser = async (req:Request, res:Response) => {
        try {
            const token = req.params.token;
            const user_id = req.params.user_id;
            const result = await this.db_manager.checkTokenForUser(token, user_id);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public updateTokenForUser = async (req:Request, res:Response) => {
        try {
            const user_id = req.params.user_id;
            const result = await this.db_manager.updateTokenForUser(user_id);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public updateTokenForService = async (req:Request, res:Response) => {
        try {
            const token = req.params.token;
            const service_name = req.params.service_name;
            const result = await this.db_manager.updateTokenForService(token, service_name);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public createCode = async (req:Request, res: Response) => {
        try  {
            const client_id = req.query.client_id;
            const client_secret = req.query.client_secret;
            const user_id = req.query.user_id;

            const result = await this.db_manager.createCode(user_id, client_id, client_secret);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public createTokenForCode = async (req:Request, res:Response) => {
        try {
            const client_id = req.query.client_id;
            const client_secret = req.query.client_secret;
            const code = req.params.code;

            const result = await this.db_manager.createTokenForCode(code, client_id, client_secret);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message)
        }
    };

    public refreshTokenForCode = async (req:Request, res:Response) => {
        try {
            const client_id = req.query.client_id;
            const client_secret = req.query.client_secret;
            const refresh_token = req.params.refresh_token;

            const result = await this.db_manager.refreshTokenForCode(client_id, client_secret, refresh_token);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message)
        }
    };

    public checkTokenForCode = async (req:Request, res:Response) => {
        try {
            const token = req.query.token;
            const user_id = req.query.user_id;
            const result = await this.db_manager.checkTokenForCode(token, user_id);

            if (result) {
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };
}