import {CommonDbManager} from "../../common/commonDbManager";
import {User} from "../entity/UserEntity";
import {createHmac} from "crypto";
import {CommonErrorMessages} from "../../common/commonError";

export class AuthDBManager extends CommonDbManager<User> {
    /**
     * Вход в профиль,
     * если пользователь ровно с таким именем и паролем существует, то отдаем данные существующего,
     * если пользователь не существует, то создаем и отдаем его данные, если не был найден пользователь с таким же именем, но другим паролем
     */
    public async auth(name:string, password:string) {
        const existed_user = await this.repository.findOne({where: {name: name}});

        if (!existed_user) {
            const user_data = {
                name: name,
                password: password,
            };

            const user = await this.repository.create(user_data);
            return [await this.repository.save(user), "create"];
        }

        if (existed_user.password !== createHmac('sha256', password).digest('hex')) {
            throw Error(CommonErrorMessages.INVALID_PASSWORD)
        }

        return [existed_user, "login"];
    }
}