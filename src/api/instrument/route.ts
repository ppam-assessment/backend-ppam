import { FastifyInstance } from "fastify";
import { getAllInstrumentController, getAreaController, putInstrumentsQuestionController } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {

  app.get("/", getAllInstrumentController)
  app.put("/", {
    schema: {
      body: $ref('putInstrumentsSchema'),
    }
  }, putInstrumentsQuestionController)

  app.get("/area", getAreaController)

  done();
}
