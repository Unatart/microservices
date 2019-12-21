import {cirquitBreaker} from "../../common/cirquitBreaker/cirquitBreaker";
import {CommonMiddleware} from "../../common/middleware/CommonMiddleware";

export const userCirquitBreaker = new cirquitBreaker(30000, 5, "user");
const userMiddleware = userCirquitBreaker.middleware();

export const storyCirquitBreaker = new cirquitBreaker(10000, 5, "story");
const storyMiddleware = storyCirquitBreaker.middleware();

export const notifyCirquitBreaker = new cirquitBreaker(50000, 10, "notify");
const notifyMiddleware = notifyCirquitBreaker.middleware();

export const favsCirquitBreaker = new cirquitBreaker(50000, 3, "favs");
const favsMiddleware = favsCirquitBreaker.middleware();

const middleware = new CommonMiddleware("Gateway").outerMiddleware();

export const routes = (app, controllers) => {
    app.get("/stories", storyMiddleware, controllers.getAllStories);

    // деградация функциональности
    app.get("/stories/:id", storyMiddleware, userMiddleware, controllers.getOneStory);


    // -------------------------------
    app.patch("/user/:id", middleware, userMiddleware, controllers.updateUserInfo);

    app.post("/user/:id/stories", middleware, userMiddleware, storyMiddleware, controllers.createStoryByUser);

    // очередь
    app.delete("/user/:id/stories/:story_id", middleware, storyMiddleware, favsMiddleware, controllers.deleteStoryByUser);

    app.get("/user/:id/favourites", middleware, favsMiddleware, controllers.getUserFavs);

    app.post("/user/:id/stories/:story_id/favourites", middleware, favsMiddleware, controllers.makeStoryFavForUser);

    app.delete("/user/:id/stories/:story_id/favourites", middleware, favsMiddleware, controllers.deleteStoryFromFavUser);

    app.get("/user/:id/notifications", middleware, notifyMiddleware, controllers.getUserNotifySettings);

    app.post("/user/:id/notifications", middleware, notifyMiddleware, controllers.setNotifySettings);

    app.patch("/user/:id/notifications", middleware, userMiddleware, notifyMiddleware, controllers.updateNotifySettings);
};