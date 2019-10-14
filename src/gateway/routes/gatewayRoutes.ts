export const routes = (app, controllers) => {
    // Без авторизации
    app.get("/stories", controllers.getAllStories);

    app.get("/stories/:id", controllers.getOneStory);

    // Необходима авторизация
    app.post("/user/auth", controllers.authUser);

    app.patch("/user/:id", controllers.updateUserInfo);

    app.post("/user/:id/stories/", controllers.createStoryByUser);

    app.patch("/user/:id/stories/:story_id", controllers.updateStoryByUser);

    app.delete("/user/:id/stories/:story_id", controllers.deleteStoryByUser);

    app.get("/user/:id/favourites", controllers.getUserFavs);

    app.post("/user/:id/stories/:story_id/favourites", controllers.makeStoryFavForUser);

    app.delete("/user/:id/stories/:story_id/favourites", controllers.deleteStoryFromFavUser);

    app.get("/user/:id/notifications", controllers.getUserNotifySettings);

    app.patch("/user/:id/notifications", controllers.updateNotifySettings);
};