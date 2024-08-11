var _a, _b;
// https://medium.com/@atatijr/token-based-authentication-with-fastify-jwt-and-typescript-1fa5cccc63c5
// Import the framework and instantiate it
import Fastify from 'fastify';
import fastifyExpress from '@fastify/express';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import routes from './api/index.js';
import { userSchemas } from './api/user/schema.js';
import { responseSchemas } from './api/response/schema.js';
const app = Fastify({
    logger: true
});
// Declare a route
app.register(routes, { prefix: '/' });
await app.register(fastifyExpress);
await app.register(fjwt, { secret: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_SECRET) || 'Veda Bezaleel' });
await app.register(cors, {
    // put your options here
    origin: false
});
app.addHook('preHandler', (req, res, next) => {
    // here we are
    req.jwt = app.jwt;
    return next();
});
app.register(fCookie, {
    secret: ((_b = process.env) === null || _b === void 0 ? void 0 : _b.COOKIE_SECRET) || 'Veda Bezaleel',
    hook: 'preHandler',
});
for (let schema of [...userSchemas]) {
    app.addSchema(schema);
}
for (let schema of [...responseSchemas]) {
    app.addSchema(schema);
}
// Run the server!
try {
    await app.listen({ port: 3000 });
}
catch (err) {
    app.log.error(err);
    process.exit(1);
}
