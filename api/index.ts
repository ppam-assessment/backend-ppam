import { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./user/route.js";
import instrumentRoutes from "./instrument/route.js"

export default function (app: any, opts: any, done: any) {
  app.get("/", async function testHandler(req: FastifyRequest, res: FastifyReply) {
    return res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ hello: "world!" });
  });

  app.register(userRoutes, { prefix: '/account' })
  app.register(instrumentRoutes, { prefix: '/instrument' })

  done();
}