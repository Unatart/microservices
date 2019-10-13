import {getConnection, Repository} from "typeorm";

export class CommonDbManager<T> {
    constructor(init_repo) {
        this.repository = getConnection(process.env.NODE_ENV).getRepository(init_repo);
    }

    protected repository:Repository<T>;
}