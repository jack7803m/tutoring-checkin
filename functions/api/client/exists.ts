// Because the middleware is already checking for the existence of the room, we can just return a 200 OK response here.
export async function onRequestGet(context: any): Promise<Response> {
    return new Response('');
}