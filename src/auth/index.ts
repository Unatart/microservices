import * as express from "express";
import * as bodyParser from  "body-parser";
import {winston_logger} from "../common/winston/winstonLogger";
import cors = require('cors');
import {routes} from "./routes/routes";
import {AuthControllers} from "./controllers/controllers";
import {database} from "../common/db_config";
import {createConnection} from "typeorm";
import {AuthDBManager} from "./dbManager/authDBManager";
import {User} from "./entity/UserEntity";

const app = express();
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const auth_database = {...database, schema:"user", entities: [User]};
const port = process.env.PORT || 3006;

createConnection(auth_database).then(() => {
    const auth_db_manager = new AuthDBManager(User);
    const auth_controller = new AuthControllers(auth_db_manager);
    routes(app, auth_controller);
    app.listen(port, () => {
        winston_logger.info(`API FAVOURITES running in http://localhost:${port}`);
    });
});