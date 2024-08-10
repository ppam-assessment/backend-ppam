import { FastifyInstance } from "fastify";
import { getAllInstrumentController } from "./controller.js";
// import { createUserController, loginController } from "./controller.js";
// import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {

  app.get("/", getAllInstrumentController)
  
  done();
}
