import { FastifyInstance } from "fastify";
import { $ref } from "./schema.js";
import { getViewerAccessController, postViewerAccessController, putViewerAccessController } from "./controller.js";

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
    }, putViewerAccessController)

    done();
}
