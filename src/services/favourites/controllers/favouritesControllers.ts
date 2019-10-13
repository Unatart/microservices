import {CommonControllers} from "../../../common/commonControllers";
import {FavouritesManager} from "../dbManager/favouritesManager";
import {Request, Response} from "express";
import {CommonErrorMessages, createError} from "../../../common/commonError";

export class FavouritesControllers extends CommonControllers<FavouritesManager> {
    public getFavourites = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.params.user_id;
            if (this.uuid_regex.test(user_uuid)) {
                const results = await this.db_manager.getFav(user_uuid);
                res
                    .status(200)
                    .send(results);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_USER_UUID));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public createFavourites = async (req: Request, res: Response) => {
        try {
            const user_uuid = req.body['user_id'];
            const story_uuid = req.body['story_id'];

            if (this.uuid_regex.test(user_uuid) && this.uuid_regex.test(story_uuid)) {
                const result = await this.db_manager.createFav(user_uuid, story_uuid);
                res
                    .status(201)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.UUID_INCORRECT));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }

        return res;
    };

    public deleteFavourite = async (req: Request, res: Response) => {
        try {
            const fav_uuid = req.params.story_id;

            if (this.uuid_regex.test(fav_uuid)) {
                const result = await this.db_manager.deleteFav(fav_uuid);

                res
                    .status(200)
                    .send(result);
            } else {
                res
                    .status(400)
                    .send(createError(CommonErrorMessages.INVALID_STORY_UUID));
            }
        } catch (error) {
            res
                .status(404)
                .send(createError(error.message));
        }
    };
}