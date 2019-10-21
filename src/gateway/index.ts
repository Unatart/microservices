import * as express from "express";
import * as bodyParser from  "body-parser";
import {GatewayControllers} from "./controllers/gatewayControllers";
import {routes} from "./routes/gatewayRoutes";
import {winston_logger} from "../common/winston/winstonLogger";

const app = express();
app.use(bodyParser.json());

const controller = new GatewayControllers();
routes(app, controller);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    winston_logger.info(`API GATEWAY running in http://localhost:${port}`);
});