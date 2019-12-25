import {CommonDbManager} from "../../common/commonDbManager";
import {Session} from "../entity/Session";
import * as TokenGen from "uuid-token-generator";

export class SessionDBManager extends CommonDbManager<Session> {
    public async createTokenForService(service_name:string) {
        const find_same = await this.repository.findOne({where: {service_name: service_name}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(find_same);
        }

        const session = {
            token: this.token_gen.generate(),
            expires: this.createDate(true),
            service_name: service_name
        };

        const session_res = await this.repository.create(session);
        return await this.repository.save(session_res);
    }

    public async createTokenForUser(user_id:string) {
        const find_same = await this.repository.findOne({where: {user_id: user_id}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(find_same);
        }

        const session = {
            token: this.token_gen.generate(),
            expires: this.createDate(true),
            user_id: user_id
        };

        const session_res = await this.repository.create(session);
        return await this.repository.save(session_res);
    }

    public async checkToken(token:string, service_name:string):Promise<boolean> {
        const res = await this.repository.findOne({where: {token: token, service_name: service_name}});
        const curr_d = new Date(this.createDate());
        const d = new Date(res["expires"]);
        return curr_d.getTime() < d.getTime();
    }

    public async checkTokenForUser(token:string, user_id:string):Promise<boolean> {
        const res = await this.repository.findOne({where: {token: token, user_id: user_id}});
        const curr_d = new Date(this.createDate());
        const d = new Date(res["expires"]);
        if (curr_d.getTime() < d.getTime()) {
            await this.repository.merge(res, {
                expires: this.createDate(true),
            });
            await this.repository.save(res);
            return true;
        }
        return false;
    }

    public async checkTokenForCode(token:string, user_id:string):Promise<boolean> {
        const res = await this.repository.findOne({where: {token: token, user_id: user_id}});
        const curr_d = new Date(this.createDate());
        const d = new Date(res["expires"]);
        return curr_d.getTime() < d.getTime();
    }

    public async updateTokenForUser(user_id:string) {
        const session =  await this.repository.findOne({where: {user_id: user_id}});
        if (session) {
            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(session);
        }
    }

    public async updateTokenForService(token:string, service_name:string) {
        const session =  await this.repository.findOne({where: {service_name: service_name}});
        if (session) {
            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(session);
        }
    }

    public async createCode(user_id:string, app_id:string, app_secret:string) {
        const session = {
            user_id: user_id,
            app_id: app_id,
            app_secret: app_secret,
            code: this.token_gen.generate()
        };

        const session_res = await this.repository.create(session);
        return await this.repository.save(session_res);
    }

    public async createTokenForCode(code:string, app_id:string, app_secret:string) {
        const find_same = await this.repository.findOne({where: {code: code, app_id: app_id, app_secret: app_secret}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                refresh_token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(find_same);
        }
    }

    public async refreshTokenForCode(app_id:string, app_secret:string, refresh_token:string) {
        const find_same = await this.repository.findOne({where: {refresh_token: refresh_token, app_id: app_id, app_secret: app_secret}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                refresh_token: this.token_gen.generate(),
                expires: this.createDate(true),
            });
            return await this.repository.save(find_same);
        }
    }

    private createDate(db?:boolean):string {
        let d = new Date();
        if (db) {
            d.setMinutes(d.getMinutes() + 30);
        }
        return d.toISOString().split("").slice(0, 10).join("") + " " + d.toISOString().split("").slice(11, 19).join("");
    }

    private token_gen = new TokenGen(256, TokenGen.BASE62);
}