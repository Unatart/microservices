import {User} from "../entity/user";
import {createHmac} from "crypto";
import {CommonDbManager} from "../../../common/commonDbManager";
import {CommonErrorMessages} from "../../../common/commonError";

export class UserManager extends CommonDbManager<User> {
    public async getUser(id:string) {
        const user = await this.repository.findOne(id);
        if (user) {
            return user;
        }

        throw Error(CommonErrorMessages.INVALID_USER_UUID);
    }

    /**
     * Вход в профиль,
     * если пользователь ровно с таким именем и паролем существует, то отдаем данные существующего,
     * если пользователь не существует, то создаем и отдаем его данные, если не был найден пользователь с таким же именем, но другим паролем
     */
    public async connectUser(name:string, password:string, email:string, phone:string) {
        const existed_user = await this.repository.findOne({where: {name: name}});

        if (!existed_user) {
            const user_data = {
                name: name,
                password: password,
                email: email,
                phone: phone
            };

            const user = await this.repository.create(user_data);
            return await this.repository.save(user);
        }

        if (existed_user.password !== createHmac('sha256', password).digest('hex')) {
            throw Error(CommonErrorMessages.INVALID_PASSWORD)
        }

        return existed_user;
    }

    /**
     * Проверяем, что имя, на которое меняем, не используется
     * @param id
     * @param body
     */
    public async updateUser(id:string, body:any) {
        const user = await this.repository.findOne(id);
        if (user) {
            if (user.name !== body.name) {
                const is_user_name_exist = await this.repository.findOne({where: {name: body.name}});
                if (is_user_name_exist) {
                    throw Error(CommonErrorMessages.USER_NAME_EXIST);
                }
            }
            await this.repository.merge(user, body);
            return await this.repository.save(user);
        } else {
            throw Error(CommonErrorMessages.INVALID_USER_UUID);
        }
    };

    public async deleteUser(id:string) {
        const is_user_exist = await this.repository.findOne(id);
        if (is_user_exist) {
            return await this.repository.delete(id);
        }
        throw Error(CommonErrorMessages.INVALID_USER_UUID);
    }
}