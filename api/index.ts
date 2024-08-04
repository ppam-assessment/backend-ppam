import userRoute from "./user/route.js";

export default function (app: any, opts: any, done: any) {
  app.register(userRoute, { prefix: '/user' })

  done();
}