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
                .send();
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
                .send();
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
                .send();
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
                .send();
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
                .send();
        }
    }
}