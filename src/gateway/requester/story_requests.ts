import * as fetch from "node-fetch";

export const getStories = (pageNo, size, token) => {
    return fetch("http://localhost:3002/stories?pageNo="+pageNo+"&size="+size +
        "&key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
};

export const getOneStory = (id, token) => {
    return fetch("http://localhost:3002/stories/" + id +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
};

export const createStory = (id, body, token) => {
    return fetch("http://localhost:3002/stories/" +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'post',
        body: JSON.stringify({
            ...body,
            author: id
        }),
        dataType: 'json',
        headers: {'Content-Type': 'application/json'},
    })
};

export const deleteStory = (id, token) => {
    return fetch("http://localhost:3002/stories/" + id +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
    })
};