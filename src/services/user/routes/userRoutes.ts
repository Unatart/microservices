
export const userRoutes = (app, user_controller) => {
    app.get("/users/:id", user_controller.getUser);

    app.post("/users", user_controller.connectUser);

    app.patch("/users/:id", user_controller.updateUser);

    app.delete("/users/:id", user_controller.deleteUser);
};