import * as fetch from "node-fetch";

export const getUser = async (id:string, token:string) => {
    return await fetch("http://localhost:3001/users/" + id + "?key="+process.env.user_key +"&secret=" + process.env.user_secret+"&token="+token, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
};

export const updateUser = async (id:string, body:any, token:string) => {
    return await fetch("http://localhost:3001/users/" + id + "?key="+process.env.user_key +"&secret=" + process.env.user_secret+"&token="+token, {
        method: 'patch',
        body: JSON.stringify({
            ...body
        }),
        headers: {'Content-Type': 'application/json'}
    })
};