import {CommonMiddleware} from "../../../common/middleware/CommonMiddleware";

const notify_middleware = new CommonMiddleware("Notify").innerMiddleware();

export const notificationRoutes = (app, notify_controller) => {
    app.get("/notifications/:user_id", notify_middleware, notify_controller.getNotification);

    app.post("/notifications", notify_middleware, notify_controller.createNotification);

    app.patch("/notifications/:user_id", notify_middleware, notify_controller.updateNotification);

    app.delete("/notifications/:user_id", notify_middleware, notify_controller.deleteNotification);
};