import {CommonMiddleware} from "../../../common/middleware/CommonMiddleware";

const story_middleware = new CommonMiddleware("Story").innerMiddleware();

export const storyRoutes = (app, story_controller) => {
    app.get("/stories", story_middleware, story_controller.getStories);

    app.get("/stories/:id", story_middleware, story_controller.getStory);

    app.post("/stories", story_middleware, story_controller.createStory);

    app.patch("/stories/:id", story_middleware, story_controller.updateStory);

    app.delete("/stories/:id", story_middleware, story_controller.deleteStory);
};