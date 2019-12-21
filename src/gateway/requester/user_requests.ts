import * as fetch from "node-fetch";

export const getUser = async (id:string, token:string) => {
    return await fetch("http://localhost:3001/users/" + id, {
        method: 'get',
        body: JSON.stringify({
            key: process.env.user_key,
            secret: process.env.user_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'},
    })
};

export const updateUser = async (id:string, body:any, token:string) => {
    return await fetch("http://localhost:3001/users/" + id, {
        method: 'patch',
        body: JSON.stringify({
            ...body,
            key: process.env.user_key,
            secret: process.env.user_secret,
            token: token
        }),
        headers: {'Content-Type': 'application/json'}
    })
};