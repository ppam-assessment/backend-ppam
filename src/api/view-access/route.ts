import { FastifyInstance } from "fastify";
import { $ref } from "./schema.js";
import { postViewerAccessController, putViewerAccessController } from "./controller.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.post("/", postViewerAccessController)
  app.put("/", {
    schema: {
      body: $ref('putViewerAccessSchema'),
    }
  }, putViewerAccessController)

  done();
}
