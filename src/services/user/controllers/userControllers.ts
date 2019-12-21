import {UserManager} from "../dbManager/userManager";
import {Request, Response} from "express";
import {CommonControllers} from "../../../common/commonControllers";
import {createError} from "../../../common/commonError";
import {winston_logger, winston_messages} from "../../../common/winston/winstonLogger";


export class UserControllers extends CommonControllers<UserManager> {
    public getUser = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.getUser(req.params.id);

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
                    .send(createError('Invalid user_uuid'));
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

    public connectUser = async (req: Request, res: Response) => {
        try {
            const name = req.body["name"];
            const password = req.body["password"];
            const email = req.body['email'] || "";
            const phone = req.body['phone'] || "";
            winston_logger.info(winston_messages.VALID_PASSWORD);
            winston_logger.info('check if name is !undefined..');
            if (this.password_regex.test(password) && name) {
                winston_logger.info(winston_messages.PASSWORD_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.connectUser(name, password, email, phone);
                let avail_user;
                let status;
                [avail_user, status] = [...result];

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(201)
                    .send({
                        user: avail_user,
                        cre_status: status
                    });
            } else {
                winston_logger.error(winston_messages.PASSWORD_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError('Invalid password'));
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

    public updateUser = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            winston_logger.info(winston_messages.TEST_UUID);
            winston_logger.info('test request body != undefined..');
            if (body && this.uuid_regex.test(req.params.id) && this.password_regex.test(body.password)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.updateUser(req.params.id, body);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                return res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError(winston_messages.PASSWORD_INCORRECT));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(400)
                .send(createError(error.message));
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.deleteUser(req.params.id);

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
                    .send(createError('Invalid user uuid'));
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

    /**
     * должен содержать хотя бы одну цифру,
     * хотя бы одну строчную лат. букву,
     * хотя бы одну прописную лат. букву,
     * и быть размером не меньше 8 символов
     */
    private password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
}