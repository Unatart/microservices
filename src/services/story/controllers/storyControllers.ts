import {StoryManager} from "../dbManager/storyManager";
import {Request, Response} from "express";
import {CommonControllers} from "../../../common/commonControllers";
import {createError} from "../../../common/commonError";


export class StoryControllers extends CommonControllers<StoryManager> {
    public getStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            if (this.uuid_regex.test(story_uuid)) {
                const result = await this.db_manager.getStory(story_uuid);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public getStories = async (req: Request, res: Response) => {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            const start = size * (pageNo - 1);
            const results = await this.db_manager.getStories(start, size);
            res
                .status(200)
                .send(results);
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public createStory = async (req: Request, res: Response) => {
        try {
            const result = await this.db_manager.createStory(req.body);
            res
                .status(201)
                .send(result);
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public updateStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            if (this.uuid_regex.test(story_uuid)) {
                const result = await this.db_manager.updateStory(story_uuid, req.body);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public deleteStory = async (req: Request, res: Response) => {
        try {
            const story_uuid = req.params.id;
            if (this.uuid_regex.test(story_uuid)) {
                const result = await this.db_manager.deleteStory(story_uuid);
                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError('Incorrect story uuid'));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };
}