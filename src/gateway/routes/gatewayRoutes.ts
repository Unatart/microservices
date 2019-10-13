export const routes = (app, controllers) => {
    // Без авторизации
    app.get("/stories", controllers.getAllStories);

    app.get("/stories/:id", controllers.getOneStory);

    // Необходима авторизация
    app.post("/user/auth", controllers.authUser);

    app.patch("/user/:id", controllers.updateUserInfo);

    app.post("/user/:id/stories/", controllers.createStoryByUser);

    app.patch("/user/:id/stories/:id", controllers.updateStoryByUser);

    app.delete("/user/:id/stories/:id", controllers.deleteStoryByUser);

    app.get("/user/:id/favourites", controllers.getUserFavs);

    app.post("/user/:id/stories/:id/favourites", controllers.makeStoryFavForUser);

    app.delete("/user/:id/stories/:id/favourites", controllers.deleteStoryFromFavUser);

    app.get("/user/:id/notifications", controllers.getUserNotifySettings);

    app.patch("/user/:id/notifications", controllers.updateNotifySettings);
};