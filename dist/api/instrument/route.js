import { getAllInstrumentController, getAreaController } from "./controller.js";
export default function (app, opts, done) {
    app.get("/", getAllInstrumentController);
    app.get("/area", getAreaController);
    done();
}
