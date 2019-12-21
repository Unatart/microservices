import {CommonDbManager} from "../../common/commonDbManager";
import {Session} from "../entity/Session";
import * as TokenGen from "uuid-token-generator";

export class SessionDBManager extends CommonDbManager<Session> {
    public async createTokenForService(service_name:string) {
        const token_gen = new TokenGen(256, TokenGen.BASE62);
        const session = {
            token: token_gen.generate(),
            expires: this.createDate(),
            service_name: service_name
        };

        const session_res = await this.repository.create(session);
        return await this.repository.save(session_res);
    }

    public async createTokenForUser(user_id:string) {
        const token_gen = new TokenGen(256, TokenGen.BASE62);
        const session = {
            token: token_gen.generate(),
            expires: this.createDate(),
            user_id: user_id
        };

        const session_res = await this.repository.create(session);
        return await this.repository.save(session_res);
    }

    public async checkToken(token:string, service_name:string):Promise<boolean> {
        const res = await this.repository.findOne({where: {token: token, service_name: service_name}});
        const curr_d = new Date();
        const d = new Date(res["expires"]);
        return curr_d < d;
    }

    public async checkTokenForUser(token:string, user_id:string):Promise<boolean> {
        const res = await this.repository.findOne({where: {token: token, user_id: user_id}});
        const curr_d = new Date();
        const d = new Date(res["expires"]);
        return curr_d < d;
    }

    public async updateTokenForUser(user_id:string) {
        const session =  await this.repository.findOne({where: {user_id: user_id}});
        if (session) {
            const token_gen = new TokenGen(256, TokenGen.BASE62);
            await this.repository.merge(session, {
                token: token_gen.generate()
            });
            return await this.repository.save(session);
        }
    }

    public async updateTokenForService(service_name:string) {
        const session =  await this.repository.findOne({where: {service_name: service_name}});
        if (session) {
            const token_gen = new TokenGen(256, TokenGen.BASE62);
            await this.repository.merge(session, {
                token: token_gen.generate()
            });
            return await this.repository.save(session);
        }
    }

    private createDate():string {
        const d = new Date();
        return d.toISOString().split("").slice(0, 10).join("") + " " + d.toISOString().split("").slice(11, 19).join("");
    }
}