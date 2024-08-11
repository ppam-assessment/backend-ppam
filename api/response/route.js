import { getUserResponsesController, postUserResponseController } from "./controller.js";
import { $ref } from "./schema.js";
export default function (app, opts, done) {
    app.get("/", getUserResponsesController);
    app.post("/", {
        schema: {
            body: $ref('inputResponseSchema'),
        }
    }, postUserResponseController);
    done();
}
