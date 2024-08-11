import { getAllInstrumentController } from "./controller.js";
export default function (app, opts, done) {
    app.get("/", getAllInstrumentController);
    done();
}
