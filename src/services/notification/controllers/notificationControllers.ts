import {CommonControllers} from "../../../common/commonControllers";
import {NotificationManager} from "../dbManager/notificationManager";
import {Request, Response} from "express";
import { _ } from "underscore";
import {CommonErrorMessages, createError} from "../../../common/commonError";
import {winston_logger, winston_messages} from "../../../common/winston/winstonLogger";

export class NotificationControllers extends CommonControllers<NotificationManager> {
    public getNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.params.user_id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.getNotify(user_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

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

            winston_logger.info(winston_messages.TEST_UUID);
            console.log(user_uuid);
            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.createNotify(user_uuid, email, phone);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(201)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

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

            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(user_uuid) && !_.isUndefined(email) && !_.isUndefined(phone)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.updateNotify(user_uuid, email, phone);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            res
                .status(400)
                .send(createError(error.message));
        }

        return res;
    };

    public deleteNotification = async (req: Request, res:Response) => {
        try {
            const user_uuid = req.params.user_id;

            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.deleteNotify(user_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };
}