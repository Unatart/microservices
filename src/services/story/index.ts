import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {storyRoutes} from "./routes/storyRoutes";
import {database} from "../../common/db_config";
import {StoryManager} from "./dbManager/storyManager";
import {StoryControllers} from "./controllers/storyControllers";
import {Story} from "./entity/story";
import {winston_logger} from "../../common/winston/winstonLogger";

const app = express();
app.use(bodyParser.json());

const story_database = {...database, schema:"story", entities: [Story]};
createConnection(story_database).then(() => {
    const story_db_manager = new StoryManager(Story);
    const story_controller = new StoryControllers(story_db_manager);
    storyRoutes(app, story_controller);
    app.listen(3002, () => {
        winston_logger.info(`API STORY running in http://localhost:${3002}`);
    });
});