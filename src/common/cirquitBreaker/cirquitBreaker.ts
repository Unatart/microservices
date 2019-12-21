import {q_favs, q_story} from "../queue/queue";
import {winston_logger} from "../winston/winstonLogger";

interface ICounter {
    timeout_ms:number;
    try:number;
    N:number;
}

export class cirquitBreaker {
    constructor(timeout_ms, N, name) {
        this.service = {
            timeout_ms: timeout_ms,
            N: N,
            try: 0
        };
        this.name = name;
    }

    public middleware() {
        const self = this;
        return function(req, res, next) {
            winston_logger.info("CIRQUITBREACKER_MIDDLEWARE: " + self.name);
            if (self.isBlocked()) {
                return res.status(503).send();
            }

            if (self.name === "story") {
                q_story.pop();
            }

            if (self.name === "favs") {
                q_favs.pop();
            }

            next();
        }
    }

    public upTry() {
        this.service.try = this.service.try + 1;
        if (this.service.N === this.service.try) {
            setTimeout(() => {
                this.service.try = 0;
            }, this.service.timeout_ms);
        }
    }

    public isBlocked() {
        return this.service.N === this.service.try;
    }


    public service:ICounter;
    private name:string;
}