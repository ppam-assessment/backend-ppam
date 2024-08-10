import { FastifyInstance } from "fastify";
import { postUserResponse } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.post("/", {
    schema: {
      body: $ref('inputResponse'),
    }
  }, postUserResponse)
  
  done();
}
