export const routes = (app, controllers) => {
    app.post("/auth", controllers.connectUser);
};