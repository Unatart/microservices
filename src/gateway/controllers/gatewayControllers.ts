import {Request, Response} from "express";
import * as fetch from "node-fetch";
import {createError} from "../../common/commonError";

export class GatewayControllers {
    public async getAllStories(req: Request, res: Response) {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const size = parseInt(req.query.size) || 10;
            const response = await fetch("http://localhost:3002/stories?pageNo="+pageNo+"&size="+size, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const body = await response.json();

            return res
                .status(response.status)
                .send(body);
        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getOneStory(req: Request, res: Response) {
        try {
            const story_response = await fetch("http://localhost:3002/stories/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            if (story_response.status >= 400) {
                return res
                    .status(story_response.status)
                    .send(story);
            }

            const user_response = await fetch("http://localhost:3001/users/" + story.author, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const user = await user_response.json();

            if (user_response.status >= 400) {
                return res
                    .status(user_response.status)
                    .send(user);
            }

            return res
                .status(200)
                .send( {
                    story_id: story.id,
                    theme: story.theme,
                    author: user.name,
                    article: story.article
                });

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async authUser(req: Request, res: Response) {
        try {
            const user_response = await fetch("http://localhost:3001/users/", {
                method: 'post',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'}
            });

            const user_body = await user_response.json();

            if (user_response.status >= 400) {
                return res
                    .status(user_response.status)
                    .send(user_body);
            }

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
                return res
                    .status(notify_response.status)
                    .send(notify_body);
            }

            return res
                .status(200)
                .send(
                    {
                        user: user_body,
                        notifications: notify_body
                    }
                );
        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateUserInfo(req: Request, res: Response) {
        try {
            const user_response = await fetch("http://localhost:3001/users/" + req.params.id, {
                method: 'patch',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'}
            });

            const user_body = await user_response.json();

            return res
                .status(user_response.status)
                .send(user_body);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async createStoryByUser(req: Request, res: Response) {
        try {
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

            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateStoryByUser(req: Request, res: Response) {
        try {
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

            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async deleteStoryByUser(req: Request, res: Response) {
        try {
            await fetch("http://localhost:3003/favourites/" + req.params.story_id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            const story_response = await fetch("http://localhost:3002/stories/" + req.params.id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            const story = await story_response.json();

            return res
                .status(story_response.status)
                .send(story);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getUserFavs(req: Request, res: Response) {
        try {
            const fav_response = await fetch("http://localhost:3003/favourites/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const fav = await fav_response.json();

            return res
                .status(fav_response.status)
                .send(fav);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async makeStoryFavForUser(req: Request, res: Response) {
        try {
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

            return res
                .status(fav_response.status)
                .send(fav);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async deleteStoryFromFavUser(req: Request, res: Response) {
        try {
            const notify_response = await fetch("http://localhost:3004/notifications?user_id=" + req.params.id + "&story_id=" + req.params.story_id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async getUserNotifySettings(req: Request, res: Response) {
        try {
            const notify_response = await fetch("http://localhost:3004/notifications/" + req.params.id, {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }

    public async updateNotifySettings(req: Request, res: Response) {
        try {
            const notify_response = await fetch("http://localhost:3004/notifications/" + req.params.id, {
                method: 'patch',
                body: JSON.stringify(req.body),
                dataType: 'json',
                headers: {'Content-Type': 'application/json'},
            });

            const notifications = await notify_response.json();

            return res
                .status(notify_response.status)
                .send(notifications);

        } catch (error) {
            return res
                .status(400)
                .send(createError(error.message));
        }
    }
}