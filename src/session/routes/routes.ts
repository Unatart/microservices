export const sessionRoutes = (app, controllers) => {
    app.get("/token/:token/service/:service_name", controllers.checkTokenForService);

    app.get("/user/:user_id/token/:token", controllers.checkTokenForUser);

    app.patch("/user/:user_id/token/", controllers.updateTokenForUser);

    app.patch("/token/:token/service/:service_name", controllers.updateTokenForService);

    app.post("/user/:user_id/token", controllers.createTokenForUser);

    app.post("/token/:service_name", controllers.createTokenForService);

    app.get("/code", controllers.checkTokenForCode);

    app.post("/code", controllers.createCode);

    app.post("/code/:code/", controllers.createTokenForCode);

    app.patch("/refresh_token/:refresh_token/", controllers.refreshTokenForCode);
};