import * as express from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {storyRoutes} from "./routes/storyRoutes";
import {database} from "../../common/db_config";
import {StoryManager} from "./dbManager/storyManager";
import {StoryControllers} from "./controllers/storyControllers";
import {Story} from "./entity/story";

const app = express();
app.use(bodyParser.json());

createConnection(database).then(() => {
    const story_db_manager = new StoryManager(Story);
    const story_controller = new StoryControllers(story_db_manager);
    storyRoutes(app, story_controller);
    app.listen(3002);
});