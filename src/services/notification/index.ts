import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {database} from "../../common/db_config";
import {notificationRoutes} from "./routes/notificationRoutes";
import {NotificationControllers} from "./controllers/notificationControllers";
import {NotificationManager} from "./dbManager/notificationManager";
import {Notification} from "./entity/notification";
import {winston_logger} from "../../common/winston/winstonLogger";

const app = express();
app.use(bodyParser.json());

const notify_database = {...database, schema:"notify", entities: [Notification]};
createConnection(notify_database).then(() => {
    const notify_db_manager = new NotificationManager(Notification);
    const notify_controller = new NotificationControllers(notify_db_manager);
    notificationRoutes(app, notify_controller);
    app.listen(3004, () => {
        winston_logger.info(`API NOTIFICATION running in http://localhost:${3004}`);
    });
});