import {CommonControllers} from "../../../common/commonControllers";
import {FavouritesManager} from "../dbManager/favouritesManager";
import {Request, Response} from "express";
import {CommonErrorMessages, createError} from "../../../common/commonError";
import {winston_logger, winston_messages} from "../../../common/winston/winstonLogger";

export class FavouritesControllers extends CommonControllers<FavouritesManager> {
    public getFavourites = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.user_id;
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            const start = size * (pageNo - 1);
            winston_logger.info(winston_messages.TEST_UUID);

            if (this.uuid_regex.test(user_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const results = await this.db_manager.getFav(user_uuid, start, size);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(results);

                return res
                    .status(200)
                    .send(results);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public createFavourites = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.body['user_id'];
            const story_uuid = req.body['story_id'];
            winston_logger.info(winston_messages.TEST_UUID);

            if (this.uuid_regex.test(user_uuid) && this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.createFav(user_uuid, story_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                return res
                    .status(201)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError(CommonErrorMessages.UUID_INCORRECT));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public deleteFavouriteByQuery = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.query.user_id;
            const story_uuid = req.query.story_id;
            winston_logger.info(winston_messages.TEST_UUID);

            if (this.uuid_regex.test(user_uuid) && this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.deleteFav(user_uuid, story_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.UUID_INCORRECT));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            res
                .status(404)
                .send(createError(error.message));
        }
    };

    public deleteFavouritesByStory = async (req: Request, res: Response) => {
        try {
            console.log("HERE");
            const story_uuid = req.params.story_id;
            winston_logger.info(winston_messages.TEST_UUID);

            if (this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.deleteFavStories(story_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_STORY_UUID));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            res
                .status(404)
                .send(createError(error.message));
        }
    }
}