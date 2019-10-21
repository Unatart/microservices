import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {UserManager} from "./dbManager/userManager";
import {userRoutes} from "./routes/userRoutes";
import {database} from "../../common/db_config";
import {UserControllers} from "./controllers/userControllers";
import {User} from "./entity/user";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"user", entities: [User]};
createConnection(user_database).then(() => {
    const user_db_manager = new UserManager(User);
    const user_controller = new UserControllers(user_db_manager);
    userRoutes(app, user_controller);
    app.listen(3001, () => {
            console.log(`API REST running in http://localhost:${3001}`);
    });
});