import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {database} from "../../common/db_config";
import {favouritesRoutes} from "./routes/favouritesRoutes";
import {FavouritesControllers} from "./controllers/favouritesControllers";
import {FavouritesManager} from "./dbManager/favouritesManager";
import {Favourites} from "./entity/favourites";

const app = express();
app.use(bodyParser.json());

const fav_database = {...database, schema:"fav", entities: [Favourites]};
createConnection(fav_database).then(() => {
    const fav_db_manager = new FavouritesManager(Favourites);
    const fav_controller = new FavouritesControllers(fav_db_manager);
    favouritesRoutes(app, fav_controller);
    app.listen(3003);
});