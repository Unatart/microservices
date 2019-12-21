import {CommonMiddleware} from "../../../common/middleware/CommonMiddleware";

const fav_middleware = new CommonMiddleware("Favs").innerMiddleware();

export const favouritesRoutes = (app, fav_controller) => {
    app.get("/favourites/:user_id", fav_middleware, fav_controller.getFavourites);

    app.post("/favourites", fav_middleware, fav_controller.createFavourites);

    app.delete("/favourites", fav_middleware, fav_controller.deleteFavouriteByQuery);

    app.delete("/favourites/:story_id", fav_middleware, fav_controller.deleteFavouritesByStory);
};