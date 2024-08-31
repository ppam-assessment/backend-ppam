import { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./account/route.js";
import instrumentRoutes from "./instrument/route.js"
import responseRoutes from "./response/route.js"
import viewAccessRoutes from "./view-access/route.js"

export default function (app: any, opts: any, done: any) {
  app.get("/", async function testHandler(req: FastifyRequest, res: FastifyReply) {
    return res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ hello: "world!" });
  });

  app.register(userRoutes, { prefix: '/account' })
  app.register(instrumentRoutes, { prefix: '/instrument' })
  app.register(responseRoutes, { prefix: '/response' })
  app.register(viewAccessRoutes, { prefix: '/view-access' })

  done();
}