import {UserManager} from "../dbManager/userManager";
import {Request, Response} from "express";
import {CommonControllers} from "../../../common/commonControllers";
import {createError} from "../../../common/commonError";


export class UserControllers extends CommonControllers<UserManager> {
    public getUser = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.id;
            if (this.uuid_regex.test(user_uuid)) {
                const result = await this.db_manager.getUser(req.params.id);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError('Invalid user_uuid'));
            }
        } catch (error) {
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
            if (this.password_regex.test(password) && name) {
                const result = await this.db_manager.connectUser(name, password, email, phone);
                res
                    .status(201)
                    .send(result);
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

    public updateUser = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            if (body) {
                const result = await this.db_manager.updateUser(req.params.id, body);
                return res
                    .status(200)
                    .send(result);
            } else {
                return res
                    .status(400)
                    .send(createError('Incorrect body request'));
            }
        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.id;
            if (this.uuid_regex.test(user_uuid)) {
                const result = await this.db_manager.deleteUser(req.params.id);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError('Invalid user uuid'));
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