import {Request, Response} from "express";
import {CommonErrorMessages, createError} from "../../common/commonError";
import {winston_logger, winston_messages} from "../../common/winston/winstonLogger";
import * as fetch from "node-fetch";
import {
    favsCirquitBreaker,
    notifyCirquitBreaker,
    storyCirquitBreaker,
    userCirquitBreaker
} from "../routes/gatewayRoutes";
import {q_favs, q_story} from "../../common/queue/queue";
import {getUser, updateUser} from "../requester/user_requests";
import {createStory, deleteStory, getOneStory, getStories} from "../requester/story_requests";
import {deleteFavs, deleteFavsByStory, getFavs, makeFavs} from "../requester/favs_requests";
import {createNotify, getNotify, updateNotify} from "../requester/notify_requests";

let user_token;
let favs_token;
let story_token;
let notify_token;

export class GatewayControllers {
    public async getAllStories(req: Request, res: Response) {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;

            winston_logger.info("GET /stories");
            winston_logger.info('get all stories..\nwith pageNo =' + pageNo+ ' number of stories =' + size);
            const response = await getStories(pageNo, size, story_token)
                .catch((error) => {
                    storyCirquitBreaker.upTry();
                    return res.status(503).send(error.message);
                });

            const body = await response.json();
            if (response.status === 449) {
                story_token = body.token;
                const response2 = await getStories(pageNo, size, story_token);
                const body2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(body2);
            }

            if (body.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                story_token = body_refresh.token;
                const response2 = await getStories(pageNo, size, story_token);
                const body2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(body2);
            }

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
        let story;
        try {
            winston_logger.info("GET /stories/:id");
            winston_logger.info('get one story with id:', req.params.id);
            const story_response = await getOneStory(req.params.id, story_token).catch(() => {
                storyCirquitBreaker.upTry();
                Promise.resolve();
            });

            story = await story_response.json();

            let story_body;
            if (story_response.status === 449) {
                story_token = story.token;
                const response2 = await getOneStory(req.params.id, story_token);
                story_body = await response2.json();
            }
            if (story.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                story_token = body_refresh.token;
                const response2 = await getOneStory(req.params.id, story_token);
                story_body = await response2.json();
            }

            if (story_body) {
                story = story_body;
            }
            winston_logger.info('get user with id ' + story.author);
            const user_response = await getUser(story.author, user_token).catch(() => {
                userCirquitBreaker.upTry();
                Promise.resolve();
            });

            const user = await user_response.json();

            if (user_response.status >= 400) {
                if (user_response.status === 449) {
                    user_token = user.token;
                    const retry_response = await getUser(req.params.id, user_token);
                    const body2 = await retry_response.json();
                    return res
                        .status(200)
                        .send({
                            id: story.id,
                            author: body2.name,
                            article: story.article,
                            theme: story.theme
                        });
                }
                if (user.message === "expired token") {
                    const result_refresh = await fetch("http://localhost:3007/token/" + user_token + "/service/User", {
                        method: "patch",
                        headers: {'Content-Type': 'application/json'},
                    });
                    const body_refresh = await result_refresh.json();
                    user_token = body_refresh.token;
                    const response2 = await getUser(req.params.id, user_token);
                    const body2 = await response2.json();
                    return res
                        .status(200)
                        .send({
                            id: story.id,
                            author: body2.name,
                            article: story.article,
                            theme: story.theme
                        });
                }

                return res
                    .status(200)
                    .send({
                        id: story.id,
                        article: story.article,
                        theme: story.theme
                    });
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
            if (story) {
                return res
                    .status(200)
                    .send({
                        story_id: story.id,
                        theme: story.theme,
                        article: story.article
                    });
            }

            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateUserInfo(req: Request, res: Response) {
        try {
            winston_logger.info("PATCH /user/:id");
            winston_logger.info('patch user info with id = ' + req.params.id);
            const user_response = await updateUser(req.params.id, req.body, user_token)
                .catch(() => {
                    userCirquitBreaker.upTry();
                    return res.status(503).send();
                });

            const user = await user_response.json();

            if (user_response.status === 449) {
                user_token = user.token;
                const retry_response = await updateUser(req.params.id, req.body, user_token);
                const body2 = await retry_response.json();
                return res
                    .status(200)
                    .send(body2);
            }
            if (user.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + user_token + "/service/User", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                user_token = body_refresh.token;
                const retry_response = await updateUser(req.params.id, req.body, user_token);
                const body2 = await retry_response.json();
                return res
                    .status(200)
                    .send(body2);
            }

            winston_logger.info(winston_messages.OK);
            return res
                .status(user_response.status)
                .send(user);

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
            winston_logger.info("POST /user/:id/stories");
            winston_logger.info('create story by user with id = ' + req.params.id);
            const story_response = await createStory(req.params.id, req.body, story_token).catch(() => {
                storyCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const story = await story_response.json();

            if (story_response.status === 449) {
                story_token = story.token;
                console.log(story_token);
                const response2 = await createStory(req.params.id, req.body, story_token);
                const story2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(story2);
            }
            if (story.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                story_token = body_refresh.token;
                const response2 = await createStory(req.params.id, req.body, story_token);
                const story2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(story2);
            }

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
            let failed = false;
            winston_logger.info("DELETE /user/:id/stories/:story_id");
            winston_logger.info('delete story from favourites..');
            const fav_resp = await deleteFavsByStory(req.params.story_id, favs_token).catch(() => {
                q_favs.push({
                    url: "http://localhost:3003/favourites/" + req.params.story_id,
                    body: {
                        key: process.env.favs_key,
                        secret: process.env.favs_secret,
                        token: favs_token
                    },
                    headers: {'Content-Type': 'application/json'},
                    method: 'delete'
                });
                favsCirquitBreaker.upTry();
                failed = true;
                return Promise.resolve();
            });

            const fav = await fav_resp.json();
            if (fav_resp.status === 449) {
                favs_token = fav.token;
                await deleteFavsByStory(req.params.story_id, favs_token);
            }
            if (fav.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + favs_token + "/service/Favs", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                favs_token = body_refresh.token;
                await deleteFavsByStory(req.params.story_id, favs_token);
            }

            winston_logger.info('delete story...');
            const story_response = await deleteStory(req.params.story_id, story_token).catch(() => {
                q_story.push({
                    url: "http://localhost:3002/stories/" + req.params.story_id,
                    method: 'delete'
                });
                storyCirquitBreaker.upTry();
                failed = true;
                return Promise.resolve();
            });

            if (failed) {
                return res.status(200).send();
            }

            const story = await story_response.json();

            if (story_response.status === 449) {
                story_token = story.token;
                const response2 = await deleteStory(req.params.story_id, story_token);
                const story2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(story2);
            }
            if (story.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                story_token = body_refresh.token;
                const response2 = await deleteStory(req.params.story_id, story_token);
                const story2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(story2);
            }

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
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            winston_logger.info("GET /user/:id/favourites");
            winston_logger.info('get favourites for user with id = ' + req.params.id);
            const fav_response = await getFavs(req.params.id, pageNo, size, favs_token).catch(() => {
                favsCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const fav = await fav_response.json();

            if (fav_response.status === 449) {
                favs_token = fav.token;
                const response2 = await getFavs(req.params.id, pageNo, size, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }
            if (fav.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + favs_token + "/service/Favs", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                favs_token = body_refresh.token;
                const response2 = await getFavs(req.params.id, pageNo, size, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }

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
            winston_logger.info("POST /user/:id/stories/:story_id/favourites");
            winston_logger.info('make story with id = ' + req.params.story_id + ' favourite for user with id = ' + req.params.id);
            const fav_response = await makeFavs(req.params.id, req.params.story_id, favs_token).catch(() => {
                favsCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const fav = await fav_response.json();

            if (fav_response.status === 449) {
                favs_token = fav.token;
                const response2 = await makeFavs(req.params.id, req.params.story_id, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }
            if (fav.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + favs_token + "/service/Favs", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                favs_token = body_refresh.token;
                const response2 = await makeFavs(req.params.id, req.params.story_id, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }

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
            winston_logger.info("DELETE /user/:id/stories/:story_id/favourites");
            winston_logger.info('delete story from favourites..');
            const fav_response = await deleteFavs(req.params.id, req.params.story_id, favs_token)
                .catch(() => {
                favsCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const fav = await fav_response.json();

            if (fav_response.status === 449) {
                favs_token = fav.token;
                const response2 = await deleteFavs(req.params.id, req.params.story_id, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }
            if (fav.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + favs_token + "/service/Favs", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                favs_token = body_refresh.token;
                const response2 = await deleteFavs(req.params.id, req.params.story_id, favs_token);
                const fav2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(fav2);
            }

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

    public async getUserNotifySettings(req: Request, res: Response) {
        try {
            winston_logger.info("GET /user/:id/notifications");
            winston_logger.info('get user notifications settings..');
            const notify_response = await getNotify(req.params.id, notify_token).catch(() => {
                notifyCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const notifications = await notify_response.json();

            if (notify_response.status === 449) {
                notify_token = notifications.token;
                const response2 = await getNotify(req.params.id, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }
            if (notifications.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + notify_token + "/service/Notify", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                notify_token = body_refresh.token;
                const response2 = await getNotify(req.params.id, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }

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

    public async setNotifySettings(req:Request, res:Response) {
        try {
            const notify_response = await createNotify(req.params.id, req.body, notify_token).catch(() => {
                notifyCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const notifications = await notify_response.json();

            if (notify_response.status === 449) {
                notify_token = notifications.token;
                const response2 = await createNotify(req.params.id, req.body, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }
            if (notifications.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + notify_token + "/service/Notify", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                notify_token = body_refresh.token;
                const response2 = await createNotify(req.params.id, req.body, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }

            return res
                .status(200)
                .send(notifications);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateNotifySettings(req: Request, res: Response) {
        try {
            winston_logger.info("PATCH /user/:id/notifications");
            winston_logger.info('get user data..');
            const user_response = await getUser(req.params.id, user_token).catch(() => {
                userCirquitBreaker.upTry();
                return res.status(503).send();
            });

            let user_settings = await user_response.json();

            let body;
            if (user_response.status === 449) {
                user_token = user_settings.token;
                const retry_response = await updateUser(req.params.id, req.body, user_token);
                body = await retry_response.json();
            }
            if (user_settings.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + user_token + "/service/User", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                user_token = body_refresh.token;
                const retry_response = await updateUser(req.params.id, req.body, user_token);
                body = await retry_response.json();
            }

            user_settings = body;

            if(!user_settings.email && !user_settings.phone) {
                winston_logger.error('user don\'t have email or phone to enable notifications');
                winston_logger.error(winston_messages.ERROR);

                return res
                    .status(400)
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
            const notify_response = await updateNotify(req.params.id, req.body, notify_token).catch(() => {
                notifyCirquitBreaker.upTry();
                return res.status(503).send();
            });

            const notifications = await notify_response.json();

            if (notify_response.status === 449) {
                notify_token = notifications.token;
                const response2 = await updateNotify(req.params.id, req.body, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }
            if (notifications.message === "expired token") {
                const result_refresh = await fetch("http://localhost:3007/token/" + notify_token + "/service/Notify", {
                    method: "patch",
                    headers: {'Content-Type': 'application/json'},
                });
                const body_refresh = await result_refresh.json();
                notify_token = body_refresh.token;
                const response2 = await updateNotify(req.params.id, req.body, notify_token);
                const notify2 = await response2.json();
                return res
                    .status(response2.status)
                    .send(notify2);
            }

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