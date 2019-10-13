export const notificationRoutes = (app, notify_controller) => {
    app.get("/notifications/:user_id", notify_controller.getNotification);

    app.post("/notifications", notify_controller.createNotification);

    app.patch("/notifications/:user_id", notify_controller.updateNotification);

    app.delete("/notifications/:user_id", notify_controller.deleteNotification);
};