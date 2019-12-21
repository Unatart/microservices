import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {UserManager} from "./dbManager/userManager";
import {userRoutes} from "./routes/userRoutes";
import {database} from "../../common/db_config";
import {UserControllers} from "./controllers/userControllers";
import {winston_logger} from "../../common/winston/winstonLogger";
import {User} from "../../auth/entity/UserEntity";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"user", entities: [User]};
createConnection(user_database).then(() => {
    const user_db_manager = new UserManager(User);
    const user_controller = new UserControllers(user_db_manager);
    userRoutes(app, user_controller);
    app.listen(3001, () => {
            winston_logger.info(`API USER running in http://localhost:${3001}`);
    });
});