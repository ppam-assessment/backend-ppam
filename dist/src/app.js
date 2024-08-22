import Fastify from 'fastify';
import fastifyExpress from '@fastify/express';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import 'dotenv/config';
import routes from './api/index.js';
import { userSchemas } from './api/user/schema.js';
import { responseSchemas } from './api/response/schema.js';
const app = Fastify({
    logger: true
});
app.register(routes, { prefix: '/' });
await app.register(fastifyExpress);
await app.register(fjwt, { secret: process.env?.JWT_SECRET || 'Veda Bezaleel' });
await app.register(cors, {
    origin: '*'
});
app.addHook('preHandler', (req, res, next) => {
    req.jwt = app.jwt;
    return next();
});
app.register(fCookie, {
    secret: process.env?.COOKIE_SECRET || 'Veda Bezaleel',
    hook: 'preHandler',
});
for (let schema of [...userSchemas]) {
    app.addSchema(schema);
}
for (let schema of [...responseSchemas]) {
    app.addSchema(schema);
}
try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
}
catch (err) {
    app.log.error(err);
    process.exit(1);
}
