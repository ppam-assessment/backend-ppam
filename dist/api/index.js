import userRoutes from "./user/route.js";
import instrumentRoutes from "./instrument/route.js";
import responseRoutes from "./response/route.js";
export default function (app, opts, done) {
    app.get("/", async function testHandler(req, res) {
        return res
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ hello: "world!" });
    });
    app.register(userRoutes, { prefix: '/account' });
    app.register(instrumentRoutes, { prefix: '/instrument' });
    app.register(responseRoutes, { prefix: '/response' });
    done();
}
