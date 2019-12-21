import * as fetch from "node-fetch";

export const updateNotify = async (id, body, token) => {
    return await fetch("http://localhost:3004/notifications/" + id, {
        method: 'patch',
        body: JSON.stringify({
            ...body,
            key: process.env.notify_key,
            secret: process.env.notify_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const createNotify = async (body, token) => {
    return await fetch("http://localhost:3004/notifications/", {
        method: 'post',
        body: JSON.stringify({
            user_id: body.user_id,
            email: body.email,
            phone: body.phone,
            key: process.env.notify_key,
            secret: process.env.notify_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'}
    })
};

export const getNotify = async (id, token) => {
    return await fetch("http://localhost:3004/notifications/" + id, {
        method: 'get',
        body: JSON.stringify({
            key: process.env.notify_key,
            secret: process.env.notify_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};