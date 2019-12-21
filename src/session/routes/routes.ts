export const routes = (app, controllers) => {
    app.get("/token/:token", controllers.checkTokenForService);

    app.get("/token", controllers.checkTokenForUser);

    app.patch("/token/", controllers.updateTokenForUser);

    app.patch("/token/:service_name", controllers.updateTokenForService);

    app.post("/token", controllers.createTokenForUser);

    app.post("/token/:service_name", controllers.createTokenForService);
};