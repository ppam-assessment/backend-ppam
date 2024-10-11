import Fastify from 'fastify'
import fastifyExpress from '@fastify/express'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import cors from '@fastify/cors'

import 'dotenv/config'

import routes from './api/index.js'
import { userSchemas } from './api/account/schema.js'
import { responseSchemas } from './api/response/schema.js'
import { viewerAccessSchema } from './api/view-access/schema.js'
import { instrumentSchema } from './api/instrument/schema.js'
import { submitterAccessSchema } from './api/submit-access/schema.js'


const app = Fastify({
  logger: true
})

// Declare a route
app.register(routes, { prefix: '/' })

await app.register(fastifyExpress)
await app.register(fjwt, { secret: process.env?.JWT_SECRET || 'Veda Bezaleel' })
await app.register(cors, { 
  // put your options here
  origin: '*'
})

app.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = app.jwt
  return next()
})
app.register(fCookie, {
  secret: process.env?.COOKIE_SECRET || 'Veda Bezaleel',
  hook: 'preHandler',
})

for (let schema of [...userSchemas, ...responseSchemas, ...viewerAccessSchema, ...instrumentSchema, ...submitterAccessSchema]) {
  app.addSchema(schema)
}

// Run the server!
try {
  await app.listen({ port: 3000, host:'127.0.0.1' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}