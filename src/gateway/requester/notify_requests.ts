import * as fetch from "node-fetch";

export const updateNotify = (id, body, token) => {
    return fetch("http://localhost:3004/notifications/" + id +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'patch',
        body: JSON.stringify({
            ...body
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const createNotify = (body, token) => {
    return fetch("http://localhost:3004/notifications/" +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'post',
        body: JSON.stringify({
            user_id: body.user_id,
            email: body.email,
            phone: body.phone,
        }),
        headers: {'Content-Type': 'application/json'}
    })
};

export const getNotify = (id, token) => {
    return fetch("http://localhost:3004/notifications/" + id +
        "?key="+process.env.story_key +"&secret=" + process.env.story_secret+"&token="+token, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
};