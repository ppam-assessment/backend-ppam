import { FastifyInstance } from "fastify";
import { $ref } from "./schema.js";
import { getViewerAccessController, postViewerAccessController, putResubmitAccessController, putViewerAccessController } from "./controller.js";

export default function (app: FastifyInstance, opts: any, done: any) {
    app.get("/", getViewerAccessController)
    app.post("/", {
        schema: {
            body: $ref('postViewerAccessSchema'),
        }
    }, postViewerAccessController)
    app.put("/", {
        schema: {
            body: $ref('putViewerAccessSchema'),
        }
    }, putResubmitAccessController)

    app.put("/:username", {
        schema: {
            body: $ref('putViewerAccessSchema'),
        }
    }, putViewerAccessController)

    done();
}
