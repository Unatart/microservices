import * as winston from "winston";

export enum winston_messages {
    OK = 'sending OK response..',
    ERROR = 'sending error response..',
    CATCH = 'catch ERROR: ',
    BAD_REQUEST = 'response status was >= 400',
    AUTH = 'trying to auth user..',
    TEST_UUID = 'testing uuid..',
    UUID_OK = 'uuid is fine',
    UUID_INCORRECT = 'uuid is incorrect',
    VALID_PASSWORD = 'validating password..',
    PASSWORD_OK = 'password is fine',
    PASSWORD_INCORRECT = 'password is incorrect',
    CONNECT_DB = 'some db manipulations...'
}

export const winston_logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});