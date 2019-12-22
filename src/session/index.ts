import * as express from "express";
import * as bodyParser from  "body-parser";
import {winston_logger} from "../common/winston/winstonLogger";
import {database} from "../common/db_config";
import {createConnection} from "typeorm";
import {SessionDBManager} from "./dbManager/SessionDBManager";
import {SessionControllers} from "./controllers/SessionControllers";
import {sessionRoutes} from "./routes/routes";
import {Session} from "./entity/Session"

const app = express();
app.use(bodyParser.json());

const auth_database = {...database, schema:"session", entities: [Session]};
const port = process.env.PORT || 3007;

createConnection(auth_database).then(() => {
    const session_db_manager = new SessionDBManager(Session);
    const session_controller = new SessionControllers(session_db_manager);
    sessionRoutes(app, session_controller);
    app.listen(port, () => {
        winston_logger.info(`API SESSION running in http://localhost:${port}`);
    });
});