import * as fetch from "node-fetch";

export const getFavs = async (id, pageNo, size, token) => {
    return await fetch("http://localhost:3003/favourites/" + id + "?pageNo="+pageNo+"&size="+size, {
        method: 'get',
        body: JSON.stringify({
            key: process.env.favs_key,
            secret: process.env.favs_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const makeFavs = async (id, story_id, token) => {
    return await fetch("http://localhost:3003/favourites/", {
        method: 'post',
        body: JSON.stringify({
            user_id: id,
            story_id: story_id,
            key: process.env.favs_key,
            secret: process.env.favs_secret,
            token: token
        }),
        dataType: 'json',
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteFavs = async (id, story_id, token) => {
    return await fetch("http://localhost:3003/favourites/?user_id=" + id + "&story_id=" + story_id, {
        method: 'delete',
        body: JSON.stringify({
            key: process.env.favs_key,
            secret: process.env.favs_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteFavsByStory = async (story_id, token) => {
    return await fetch("http://localhost:3003/favourites/" + story_id, {
        method: 'delete',
        body: {
            key: process.env.favs_key,
            secret: process.env.favs_secret,
            token: token
        },
        headers: {'Content-Type': 'application/json'},
    })
};