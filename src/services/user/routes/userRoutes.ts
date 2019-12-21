import {CommonMiddleware} from "../../../common/middleware/CommonMiddleware";

const user_middleware = new CommonMiddleware("User").innerMiddleware();

export const userRoutes = (app, user_controller) => {
    app.get("/users/:id", user_middleware, user_controller.getUser);

    app.patch("/users/:id", user_middleware, user_controller.updateUser);
};