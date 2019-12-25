export const routes = (app, controllers) => {
    app.post("/auth", controllers.connectUser);

    app.post("/oauth", controllers.createCode);

    app.post("/oauth/token", controllers.getToken);
};