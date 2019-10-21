import * as winston from "winston";

export enum winston_messages {
    OK = 'sending OK response..',
    ERROR = 'sending error response..',
    CATCH = 'catch ERROR: ',
    BAD_REQUEST = 'response status was >= 400',
    AUTH = 'trying to auth user..'
}

export const winston_logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});