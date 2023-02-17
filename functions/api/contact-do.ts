import { DurableObjectStub } from "@cloudflare/workers-types";
import { DORequest } from "../../models/d-o-request";

export async function contactDO(obj: DurableObjectStub, path: string, doRequest: DORequest) {
    return obj.fetch(`https://tutor_do_workers.workers.dev${path}`, {
        method: "POST",
        body: JSON.stringify(doRequest),
    });
}