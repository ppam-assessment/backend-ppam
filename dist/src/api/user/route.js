import { createUserController, loginController } from "./controller.js";
import { $ref } from "./schema.js";
export default function (app, opts, done) {
    app.post("/login", {
        schema: {
            body: $ref('loginUserSchema'),
        }
    }, loginController);
    app.post("/register", {
        schema: {
            body: $ref('createUserSchema')
        }
    }, createUserController);
    app.get("/logout", loginController);
    done();
}
