import { FastifyInstance } from "fastify";
import { getResponseMetadata, getUserResponseByUsername, getUserResponsesController, postSubmitterMetadata, postUserResponseController } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.get("/", getUserResponsesController)
  app.post("/", {
    schema: {
      body: $ref('inputResponseSchema'),
    }
  }, postUserResponseController)
  app.get("/metadata", getResponseMetadata)
  app.post("/metadata", postSubmitterMetadata)
  app.get("/:username", getUserResponseByUsername)

  done();
}
