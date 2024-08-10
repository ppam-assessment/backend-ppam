import { FastifyInstance } from "fastify";
import { getUserResponsesController, postUserResponseController } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.get("/", getUserResponsesController)
  app.post("/", {
    schema: {
      body: $ref('inputResponse'),
    }
  }, postUserResponseController)

  done();
}
