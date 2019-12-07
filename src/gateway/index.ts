import * as express from "express";
import * as bodyParser from  "body-parser";
import {GatewayControllers} from "./controllers/gatewayControllers";
import {routes} from "./routes/gatewayRoutes";
import {winston_logger} from "../common/winston/winstonLogger";
import cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const controller = new GatewayControllers();
routes(app, controller);

const port = process.env.PORT || 3005;

app.listen(port, () => {
    winston_logger.info(`API GATEWAY running in http://localhost:${port}`);
});