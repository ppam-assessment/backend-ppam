import { FastifyReply, FastifyRequest } from "fastify";
import userRoute from "./user/route.js";

export default function (app: any, opts: any, done: any) {
  app.get("/", async function testHandler(req: FastifyRequest, res: FastifyReply) {
    return res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ hello: "world!" });
  });

  app.register(userRoute, { prefix: '/account' })

  done();
}