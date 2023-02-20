import { DORequest } from "models/d-o-request";
import { contactDO } from "../contact-do";

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const url = new URL(request.url);
    const roomid = url.searchParams.get("roomid");

    let inData: DORequest;
    try {
        inData = await request.json();
    } catch (e) {
        return new Response("No Data Provided", { status: 400 });
    }

    // get the room object
    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);
    let resp = await contactDO(obj, "/remove", inData);
    if (resp.status !== 200) {
        console.error("Error removing student: " + await resp.text());
        return new Response("Error removing student", { status: 400 });
    }

    return new Response("", { status: 204, statusText: "No Content" });
}