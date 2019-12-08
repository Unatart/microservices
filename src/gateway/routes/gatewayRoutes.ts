import * as fetch from "node-fetch";

interface ICounter {
    timeout_ms:number;
    try:number;
    N:number;
}

class QueueForDeleteStory {
    public push(callback:fetch) {
        this.q.push(callback);
    }

    public pop() {
        const req:fetch = this.q.pop();
        console.log(req);
        req().catch(() => this.q.push(req));
    }

    public q = [];
}


class cirquitBreaker {
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
            if (self.isBlocked()) {
                return res.status(503).send();
            }
            if (self.name === "story" && q_story.q.length !== 0) {
                q_story.pop()
            }
            if (self.name === "favs" && q_favs.q.length !== 0) {
                q_favs.pop()
            }
            next();
        }
    }

    public upTry() {
        this.service.try = this.service.try + 1;
        console.log('up');
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

export const q_favs:QueueForDeleteStory = new QueueForDeleteStory();
export const q_story:QueueForDeleteStory = new QueueForDeleteStory();

export const userCirquitBreaker = new cirquitBreaker(30000, 5, "user");
const userMiddleware = userCirquitBreaker.middleware();

export const storyCirquitBreaker = new cirquitBreaker(10000, 5, "story");
const storyMiddleware = storyCirquitBreaker.middleware();

export const notifyCirquitBreaker = new cirquitBreaker(50000, 10, "notify");
const notifyMiddleware = notifyCirquitBreaker.middleware();

export const favsCirquitBreaker = new cirquitBreaker(50000, 3, "favs");
const favsMiddleware = favsCirquitBreaker.middleware();

export const routes = (app, controllers) => {
    // Без авторизации
    app.get("/stories", storyMiddleware, controllers.getAllStories);

    // деградация функциональности
    app.get("/stories/:id", storyMiddleware, userMiddleware, controllers.getOneStory);

    // Необходима авторизация
    // если что то не сработало то отмена
    app.post("/user/auth", userMiddleware, notifyMiddleware, controllers.authUser);

    app.patch("/user/:id", userMiddleware, controllers.updateUserInfo);

    app.post("/user/:id/stories", userMiddleware, storyMiddleware, controllers.createStoryByUser);

    // app.patch("/user/:id/stories/:story_id", userMiddleware, storyMiddleware, controllers.updateStoryByUser);

    // очередь
    app.delete("/user/:id/stories/:story_id", favsMiddleware, storyMiddleware, controllers.deleteStoryByUser);

    app.get("/user/:id/favourites", favsMiddleware, controllers.getUserFavs);

    app.post("/user/:id/stories/:story_id/favourites", favsMiddleware, controllers.makeStoryFavForUser);

    app.delete("/user/:id/stories/:story_id/favourites", favsMiddleware, controllers.deleteStoryFromFavUser);

    app.get("/user/:id/notifications", notifyMiddleware, controllers.getUserNotifySettings);

    app.patch("/user/:id/notifications", userMiddleware, notifyMiddleware, controllers.updateNotifySettings);
};