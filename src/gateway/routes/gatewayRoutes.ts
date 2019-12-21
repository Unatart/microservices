import {cirquitBreaker} from "../../common/cirquitBreaker/cirquitBreaker";


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

    // очередь
    app.delete("/user/:id/stories/:story_id", storyMiddleware, favsMiddleware, controllers.deleteStoryByUser);

    app.get("/user/:id/favourites", favsMiddleware, controllers.getUserFavs);

    app.post("/user/:id/stories/:story_id/favourites", favsMiddleware, controllers.makeStoryFavForUser);

    app.delete("/user/:id/stories/:story_id/favourites", favsMiddleware, controllers.deleteStoryFromFavUser);

    app.get("/user/:id/notifications", notifyMiddleware, controllers.getUserNotifySettings);

    app.patch("/user/:id/notifications", userMiddleware, notifyMiddleware, controllers.updateNotifySettings);
};