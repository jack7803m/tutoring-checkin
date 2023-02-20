import { DORequest } from "models/d-o-request";
import { contactDO } from "../contact-do";

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const url = new URL(request.url);
    let roomid: string;
    do {
        roomid = Math.random().toString(36).substring(2, 8).toUpperCase().replace('O', '0').replace('I', '1');
    } while (await roomExists(request, env))

    // get the (new) room object
    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);

    // create the room
    let resp: DORequest;
    try {
        resp = await (await contactDO(obj, "/create", {})).json();
    } catch (e) {
        return new Response("Error creating room: " + e, { status: 400 });
    }

    return new Response(JSON.stringify({ roomid: roomid, roomtoken: resp.roomtoken }));
}

export async function roomExists(request: Request, env: any): Promise<boolean> {
    const url = new URL(request.url);
    const roomid = url.searchParams.get("roomid");

    if (!roomid) {
        return false;
    }

    // get the room object
    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);

    // ask the room object if it was just created
    let resp = await contactDO(obj, "/exists", {});
    return await resp.text() === "true";
}