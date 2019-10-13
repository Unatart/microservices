import * as express from "express";
import * as bodyParser from  "body-parser";
import {GatewayControllers} from "./controllers/gatewayControllers";
import {routes} from "./routes/gatewayRoutes";

const app = express();
app.use(bodyParser.json());

const controller = new GatewayControllers();
routes(app, controller);

app.listen(3000);