import {CommonControllers} from "../../../common/commonControllers";
import {NotificationManager} from "../dbManager/notificationManager";
import {Request, Response} from "express";
import { _ } from "underscore";
import {CommonErrorMessages, createError} from "../../../common/commonError";

export class NotificationControllers extends CommonControllers<NotificationManager> {
    public getNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.params.user_id;
            if (this.uuid_regex.test(user_uuid)) {
                const result = await this.db_manager.getNotify(user_uuid);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public createNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.body['user_id'];
            const email:boolean = !!req.body['email'];
            const phone:boolean = !!req.body['phone'];

            if (this.uuid_regex.test(user_uuid)) {
                const result = await this.db_manager.createNotify(user_uuid, email, phone);
                res
                    .status(201)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public updateNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.params.user_id;
            const email: boolean = !!req.body['email'];
            const phone: boolean = !!req.body['phone'];

            if (this.uuid_regex.test(user_uuid) && !_.isUndefined(email) && !_.isUndefined(phone)) {
                const result = await this.db_manager.updateNotify(user_uuid, email, phone);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            res
                .status(400)
                .send(createError(error.message));
        }

        return res;
    };

    public deleteNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.params.user_id;
            if (this.uuid_regex.test(user_uuid)) {
                const result = await this.db_manager.deleteNotify(user_uuid);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };
}