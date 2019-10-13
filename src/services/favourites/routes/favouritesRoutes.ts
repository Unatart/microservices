export const favouritesRoutes = (app, fav_controller) => {
    app.get("/favourites/:user_id", fav_controller.getFavourites);

    app.post("/favourites", fav_controller.createFavourites);

    app.delete("/favourites/:story_id", fav_controller.deleteFavourite);
};