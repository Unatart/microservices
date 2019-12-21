import {createHmac} from "crypto";
import {CommonDbManager} from "../../../common/commonDbManager";
import {CommonErrorMessages} from "../../../common/commonError";
import {User} from "../../../auth/entity/UserEntity";

export class UserManager extends CommonDbManager<User> {
    public async getUser(id:string) {
        const user = await this.repository.findOne(id);
        if (user) {
            return user;
        }

        throw Error(CommonErrorMessages.INVALID_USER_UUID);
    }

    /**
     * Проверяем, что имя, на которое меняем, не используется
     * @param id
     * @param body
     */
    public async updateUser(id:string, body:any) {
        const user = await this.repository.findOne(id);
        if (user) {
            if (user.password !== createHmac('sha256', body.password).digest('hex')) {
                throw Error(CommonErrorMessages.INVALID_PASSWORD)
            }
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
}