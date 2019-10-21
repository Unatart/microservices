import {ConnectionOptions} from 'typeorm';

export let database:ConnectionOptions;

if (process.env.NODE_ENV === 'production') {
    database = {
        name: "production",
        type: "postgres",
        url: process.env.DATABASE_URL,
        entities: ["src/services/*/entity/*.js"],
        logging: ["error"],
        synchronize: true
    }
}

if (process.env.NODE_ENV === 'develop') {
    database = {
        name: "develop",
        type: "postgres",
        host: "localhost",
        username: "unatart",
        password: "unatart",
        database: "micro_services",
        entities: ["src/services/*/entity/*.js"],
        logging: ["error", "query"],
        synchronize: true
    }
}

if (process.env.NODE_ENV === 'test') {
    database =  {
        name: "test",
        type: "postgres",
        host: "localhost",
        username: "unatart",
        password: "unatart",
        database: "test_micro_services",
        entities: ["src/services/*/entity/*.js"],
        logging: ["error"],
        synchronize: true
    };
}