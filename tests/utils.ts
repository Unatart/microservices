import {LoremIpsum} from "lorem-ipsum";
import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from "typeorm";
import {database} from "../src/common/db_config";
import {UserManager} from "../src/services/user/dbManager/userManager";
import {UserControllers} from "../src/services/user/controllers/userControllers";
import {userRoutes} from "../src/services/user/routes/userRoutes";
import {StoryManager} from "../src/services/story/dbManager/storyManager";
import {Story} from "../src/services/story/entity/story";
import {StoryControllers} from "../src/services/story/controllers/storyControllers";
import {storyRoutes} from "../src/services/story/routes/storyRoutes";
import {FavouritesManager} from "../src/services/favourites/dbManager/favouritesManager";
import {Favourites} from "../src/services/favourites/entity/favourites";
import {FavouritesControllers} from "../src/services/favourites/controllers/favouritesControllers";
import {favouritesRoutes} from "../src/services/favourites/routes/favouritesRoutes";
import {NotificationManager} from "../src/services/notification/dbManager/notificationManager";
import {Notification} from "../src/services/notification/entity/notification";
import {NotificationControllers} from "../src/services/notification/controllers/notificationControllers";
import {notificationRoutes} from "../src/services/notification/routes/notificationRoutes";
import {winston_logger} from "../src/common/winston/winstonLogger";
import {User} from "../src/auth/entity/UserEntity";

export const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

// противный костыль, чтобы все сервисы попали под проверку покрытия тестами
// иначе, если запускать отдельно, nyc их не видит
export function createTestServiceConnections() {
    const user_app = express();
    user_app.use(bodyParser.json());

    const user_database = {...database, schema:"user", entities: [User]};
    createConnection(user_database).then(() => {
        const user_db_manager = new UserManager(User);
        const user_controller = new UserControllers(user_db_manager);
        userRoutes(user_app, user_controller);
        user_app.listen(3001, () => {
            winston_logger.info(`TEST API USER running in http://localhost:${3001}`);
        });
    });

    const story_app = express();
    story_app.use(bodyParser.json());

    const story_database = {...database, schema:"story", entities: [Story]};
    createConnection(story_database).then(() => {
        const story_db_manager = new StoryManager(Story);
        const story_controller = new StoryControllers(story_db_manager);
        storyRoutes(story_app, story_controller);
        story_app.listen(3002, () => {
            winston_logger.info(`TEST API STORY running in http://localhost:${3002}`);
        });
    });

    const fav_app = express();
    fav_app.use(bodyParser.json());

    const fav_database = {...database, schema:"fav", entities: [Favourites]};
    createConnection(fav_database).then(() => {
        const fav_db_manager = new FavouritesManager(Favourites);
        const fav_controller = new FavouritesControllers(fav_db_manager);
        favouritesRoutes(fav_app, fav_controller);
        fav_app.listen(3003, () => {
            winston_logger.info(`TEST API FAVOURITES running in http://localhost:${3003}`);
        });
    });

    const not_app = express();
    not_app.use(bodyParser.json());

    const notify_database = {...database, schema:"notify", entities: [Notification]};
    createConnection(notify_database).then(() => {
        const notify_db_manager = new NotificationManager(Notification);
        const notify_controller = new NotificationControllers(notify_db_manager);
        notificationRoutes(not_app, notify_controller);
        not_app.listen(3004, () => {
            winston_logger.info(`TEST API NOTIFICATIONS running in http://localhost:${3004}`);
        });
    });
}
