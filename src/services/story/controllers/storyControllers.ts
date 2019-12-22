import {StoryManager} from "../dbManager/storyManager";
import {Request, Response} from "express";
import {CommonControllers} from "../../../common/commonControllers";
import {createError} from "../../../common/commonError";
import {winston_logger, winston_messages} from "../../../common/winston/winstonLogger";


export class StoryControllers extends CommonControllers<StoryManager> {
    public getStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.getStory(story_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                return res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public getStories = async (req: Request, res: Response) => {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            const start = size * (pageNo - 1);

            winston_logger.info(winston_messages.CONNECT_DB);

            const results = await this.db_manager.getStories(start, size);

            winston_logger.info(winston_messages.OK);
            winston_logger.info(results);

            return res
                .status(200)
                .send(results);
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public createStory = async (req: Request, res: Response) => {
        try {
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(req.body.author)) {
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.createStory(req.body);

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
                    .send(createError('Incorrect author uuid!'));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public updateStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.updateStory(story_uuid, req.body);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                return res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };

    public deleteStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            winston_logger.info(winston_messages.TEST_UUID);
            if (this.uuid_regex.test(story_uuid)) {
                winston_logger.info(winston_messages.UUID_OK);
                winston_logger.info(winston_messages.CONNECT_DB);

                const result = await this.db_manager.deleteStory(story_uuid);

                winston_logger.info(winston_messages.OK);
                winston_logger.info(result);

                return res
                    .status(200)
                    .send(result);
            } else {
                winston_logger.error(winston_messages.UUID_INCORRECT);
                winston_logger.error(winston_messages.BAD_REQUEST);

                return res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);

            return res
                .status(404)
                .send(createError(error.message));
        }
    };
}