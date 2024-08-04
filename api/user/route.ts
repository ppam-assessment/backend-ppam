import fastify, { FastifyInstance } from "fastify";
import { createUserController, loginController, testHandler } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.get("/", testHandler);

  app.post("/login", {
    schema: {
      body: $ref('loginUserSchema'),
    }
  }, loginController)

  app.post("/register", {
    schema: {
      body: $ref('createUserSchema')
    }
  }, createUserController)

  app.get("/logout", loginController)
  
  done();
}
