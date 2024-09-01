import { FastifyInstance } from "fastify";
import { createUserController, getAllUsers, loginController, putUserStatusBlocked } from "./controller.js";
import { $ref } from "./schema.js";

export default function (app: FastifyInstance, opts: any, done: any) {
  app.get("/", getAllUsers)

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

  app.put("/logout", loginController)

  app.put("/block/:username", putUserStatusBlocked)
  
  done();
}
