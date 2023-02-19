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

    if (!inData.studentname || inData.studentname.length < 1 || inData.studentname.length > 32) {
        return new Response("Invalid name length [1-32]", { status: 400 });
    }

    // get the room object
    let id = env.STUDENTTRACKER.idFromName(roomid);
    let obj = env.STUDENTTRACKER.get(id);

    // join the room
    let resp = await contactDO(obj, "/join", inData);
    if (resp.status !== 200) {
        console.error("Error joining room: " + await resp.text());
        return new Response("Error joining room", { status: 400 });
    }

    return new Response(await resp.text());
}