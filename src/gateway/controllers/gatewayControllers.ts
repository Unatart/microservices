import {Request, Response} from "express";
import * as fetch from "node-fetch";
import {CommonErrorMessages, createError} from "../../common/commonError";
import {winston_logger, winston_messages} from "../../common/winston/winstonLogger";

export class GatewayControllers {
    public async getAllStories(req: Request, res: Response) {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            winston_logger.info('get all stories..\nwith pageNo =' + pageNo+ ' number of stories =' + size);
            const response = await fetch("http://localhost:3002/stories?pageNo="+pageNo+"&size="+size, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const body = await response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(response.status)
                .send(body);
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getOneStory(req: Request, res: Response) {
        try {
            winston_logger.info('get one story with id:', req.params.id);
            const story_response = await fetch("http://localhost:3002/stories/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            if (story_response.status >= 400) {
                winston_logger.error(winston_messages.BAD_REQUEST);
                winston_logger.error(winston_messages.ERROR);
                winston_logger.error(story);
                return res
                    .status(story_response.status)
                    .send(story);
            }

            winston_logger.info('get user with id' + story.author);
            const user_response = await fetch("http://localhost:3001/users/" + story.author, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const user = await user_response.json();

            if (user_response.status >= 400) {
                winston_logger.error(winston_messages.BAD_REQUEST);
                winston_logger.error(winston_messages.ERROR);
                winston_logger.error(user);
                return res
                    .status(user_response.status)
                    .send(user);
            }

            winston_logger.info(winston_messages.OK);
            return res
                .status(200)
                .send( {
                    story_id: story.id,
                    theme: story.theme,
                    author: user.name,
                    article: story.article
                });

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async authUser(req: Request, res: Response) {
        try {
            winston_logger.info(winston_messages.AUTH);
            const user_response = await fetch("http://localhost:3001/users/", {
                method: 'post',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'}
            });

            const user_body = await user_response.json();

            if (user_response.status >= 400) {
                winston_logger.error(winston_messages.BAD_REQUEST);
                winston_logger.error(winston_messages.ERROR);
                winston_logger.error(user_body);
                return res
                    .status(user_response.status)
                    .send(user_body);
            }

            winston_logger.info('update notifications for user..');
            const notify_response = await fetch("http://localhost:3004/notifications/", {
                method: 'post',
                body: JSON.stringify({
                   user_id: user_body.id,
                   email: user_body.email,
                   phone: user_body.phone
                }),
                headers: {'Content-Type': 'application/json'}
            });

            const notify_body = await notify_response.json();

            if (notify_response.status >= 400) {
                winston_logger.error(winston_messages.BAD_REQUEST);
                winston_logger.error(winston_messages.ERROR);
                winston_logger.error(notify_body);
                return res
                    .status(notify_response.status)
                    .send(notify_body);
            }

            winston_logger.info(winston_messages.OK);
            return res
                .status(200)
                .send(
                    {
                        user: user_body,
                        notifications: notify_body
                    }
                );
        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateUserInfo(req: Request, res: Response) {
        try {
            winston_logger.info('patch user info with id = ' + req.params.id);
            const user_response = await fetch("http://localhost:3001/users/" + req.params.id, {
                method: 'patch',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'}
            });

            const user_body = await user_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(user_response.status)
                .send(user_body);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async createStoryByUser(req: Request, res: Response) {
        try {
            winston_logger.info('create story by user with id = ' + req.params.id);
            const story_response = await fetch("http://localhost:3002/stories/", {
                method: 'post',
                body: JSON.stringify({
                    ...req.body,
                    author: req.params.id
                }),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateStoryByUser(req: Request, res: Response) {
        try {
            winston_logger.info('update story info..');
            const story_response = await fetch("http://localhost:3002/stories/" + req.params.story_id, {
                method: 'patch',
                body: JSON.stringify({
                    ...req.body,
                    author: req.params.id
                }),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async deleteStoryByUser(req: Request, res: Response) {
        try {
            winston_logger.info('delete story from favourites..');
            await fetch("http://localhost:3003/favourites/" + req.params.story_id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            winston_logger.info('delete story...');
            const story_response = await fetch("http://localhost:3002/stories/" + req.params.story_id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getUserFavs(req: Request, res: Response) {
        try {
            winston_logger.info('get favourites for user with id = ' + req.params.id);
            const fav_response = await fetch("http://localhost:3003/favourites/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const fav = await fav_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(fav_response.status)
                .send(fav);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async makeStoryFavForUser(req: Request, res: Response) {
        try {
            winston_logger.info('make story with id = ' + req.params.story_id + ' favourite for user with id = ' + req.params.id);
            const fav_response = await fetch("http://localhost:3003/favourites/", {
                method: 'post',
                body: JSON.stringify({
                    user_id: req.params.id,
                    story_id: req.params.story_id
                }),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'},
            });

            const fav = await fav_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(fav_response.status)
                .send(fav);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async deleteStoryFromFavUser(req: Request, res: Response) {
        try {
            winston_logger.info('delete story from favourites..');
            const notify_response = await fetch("http://localhost:3003/favourites/?user_id=" + req.params.id + "&story_id=" + req.params.story_id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getUserNotifySettings(req: Request, res: Response) {
        try {
            winston_logger.info('get user notifications settings..');
            const notify_response = await fetch("http://localhost:3004/notifications/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateNotifySettings(req: Request, res: Response) {
        try {
            winston_logger.info('get user data..');
            const user_response = await fetch("http://localhost:3001/users/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const user_settings = await user_response.json();

            if(!user_settings.email && !user_settings.phone) {
                winston_logger.error('user don\'t have email or phone to enable notifications');
                winston_logger.error(winston_messages.ERROR);
                return res
                    .send(400)
                    .send(createError(CommonErrorMessages.USER_NO_SETTINGS));
            }

            if (!user_settings.email && req.body.email) {
                winston_logger.error('user want to enable email notifications, but');
                winston_logger.error('user don\'t have email to enable notifications');
                winston_logger.error(winston_messages.ERROR);
                return res
                    .status(400)
                    .send(createError(CommonErrorMessages.USER_NO_EMAIL));
            }

            if (!user_settings.phone && req.body.phone) {
                winston_logger.error('user want to enable phone notifications, but');
                winston_logger.error('user don\'t have phone to enable notifications');
                winston_logger.error(winston_messages.ERROR);
                return res
                    .status(400)
                    .send(createError(CommonErrorMessages.USER_NO_PHONE));
            }

            winston_logger.info('updating notifications settings..');
            const notify_response = await fetch("http://localhost:3004/notifications/" + req.params.id, {
                method: 'patch',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            winston_logger.info(winston_messages.OK);
            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            winston_logger.error(winston_messages.CATCH + error.message);
            winston_logger.error(winston_messages.ERROR);
            return res
                .status(400)
                .send(createError(error.message));
        }
    }
}