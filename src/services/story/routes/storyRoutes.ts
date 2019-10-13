export const storyRoutes = (app, story_controller) => {
    app.get("/stories", story_controller.getStories);

    app.get("/stories/:id", story_controller.getStory);

    app.post("/stories", story_controller.createStory);

    app.patch("/stories/:id", story_controller.updateStory);

    app.delete("/stories/:id", story_controller.deleteStory);
};