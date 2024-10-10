import { FastifyInstance } from "fastify";
import { $ref } from "./schema.js";
import { getSubmitterAccessController, postSubmitterAccessController, putResubmitAccessController, putSubmitterAccessController } from "./controller.js";

export default function (app: FastifyInstance, opts: any, done: any) {
    app.get("/", getSubmitterAccessController)
    app.post("/", {
        schema: {
            body: $ref('postSubmitterAccessSchema'),
        }
    }, postSubmitterAccessController)
    app.put("/", {
        schema: {
            body: $ref('putSubmitterAccessSchema'),
        }
    }, putResubmitAccessController)

    app.put("/:username", {
        schema: {
            body: $ref('putSubmitterAccessSchema'),
        }
    }, putSubmitterAccessController)

    done();
}
