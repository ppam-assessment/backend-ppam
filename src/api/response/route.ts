import { FastifyInstance } from "fastify";
import { getAllResponse, getUserResponseByUsername, getUserResponsesController, postUserResponseController } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.get("/", getUserResponsesController)
  app.post("/", {
    schema: {
      body: $ref('inputResponseSchema'),
    }
  }, postUserResponseController)
  app.get("/metadata", getAllResponse)
  app.get("/:username", getUserResponseByUsername)

  done();
}
