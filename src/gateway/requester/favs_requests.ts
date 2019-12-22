import * as fetch from "node-fetch";

export const getFavs = (id, pageNo, size, token) => {
    return fetch("http://localhost:3003/favourites/" + id + "?pageNo="+pageNo+"&size="+size+
        "&key="+process.env.story_key +"&secret=" + process.env.story_secret + "&token=" + token, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
};

export const makeFavs = (id, story_id, token) => {
    return fetch("http://localhost:3003/favourites/" +
        "?key=" + process.env.story_key + "&secret=" + process.env.story_secret + "&token=" + token, {
        method: 'post',
        body: JSON.stringify({
            user_id: id,
            story_id: story_id
        }),
        dataType: 'json',
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteFavs = (id, story_id, token) => {
    return fetch("http://localhost:3003/favourites/?user_id=" + id + "&story_id=" + story_id +
        "&key=" + process.env.story_key + "&secret=" + process.env.story_secret + "&token=" + token, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteFavsByStory = (story_id, token) => {
    return fetch("http://localhost:3003/favourites/" + story_id +
        "?key="+process.env.story_key + "&secret=" + process.env.story_secret + "&token=" + token, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
    })
};