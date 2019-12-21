import * as fetch from "node-fetch";

export const getStories = async (pageNo, size, token) => {
    return await fetch("http://localhost:3002/stories?pageNo="+pageNo+"&size="+size, {
        method: 'get',
        body: JSON.stringify({
            key: process.env.story_key,
            secret: process.env.story_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const getOneStory = async (id, token) => {
    return await fetch("http://localhost:3002/stories/" + id, {
        method: 'get',
        body: JSON.stringify({
            key: process.env.story_key,
            secret: process.env.story_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const createStory = async (id, body, token) => {
    return await fetch("http://localhost:3002/stories/", {
        method: 'post',
        body: JSON.stringify({
            ...body,
            author: id,
            key: process.env.story_key,
            secret: process.env.story_secret,
            token: token
        }),
        dataType: 'json',
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteStory = async (id, token) => {
    return await fetch("http://localhost:3002/stories/" + id, {
        method: 'delete',
        body: JSON.stringify({
            key: process.env.story_key,
            secret: process.env.story_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};