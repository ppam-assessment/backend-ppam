import { FastifyInstance } from "fastify";
import { getAllInstrumentController } from "./controller.js";

export default function (app: FastifyInstance, opts: any, done: any) {

  app.get("/", getAllInstrumentController)
  
  done();
}
