import { contactDO } from "./contact-do";

export const onRequest = [roomExists];

async function roomExists(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const url = new URL(request.url);
    const roomid = url.searchParams.get("roomid");

    if (url.pathname.includes("create")) {
        return next();
    }

    if (!roomid) {
        return new Response("Room ID is required", { status: 400 });
    }

    // get the room object
    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);

    // ask the room object if it was just created
    let resp = await contactDO(obj, "/exists", {});
    let exists = await resp.text() === "true";

    if (!exists) {
        return new Response("Room does not exist", { status: 400 });
    }

    return next();
}
