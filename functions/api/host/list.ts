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

    let outData: DORequest;
    try {
        outData = await resp.json();
    } catch (e) {
        return new Response("No Data Returned", { status: 400 });
    }

    // remove each student's token from the response
    outData.students?.forEach((student) => {
        delete student.token;
    });

    return new Response(JSON.stringify(outData));
}