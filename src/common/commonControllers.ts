
export class CommonControllers<T> {
    constructor(init_db_manager) {
        this.db_manager = init_db_manager;
    }

    protected db_manager:T;
    protected uuid_regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
}