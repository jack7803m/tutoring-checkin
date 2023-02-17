import { DORequest } from "models/d-o-request";
import { contactDO } from "../contact-do";

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const url = new URL(request.url);
    const roomid = url.searchParams.get("roomid");

    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);
    let resp = await contactDO(obj, "/list", {});
    if (resp.status !== 200) {
        console.error("Error listing room: " + await resp.text());
        return new Response("Error listing room", { status: 400 });
    }

    return new Response(await resp.text());
}