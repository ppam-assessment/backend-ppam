// https://medium.com/@atatijr/token-based-authentication-with-fastify-jwt-and-typescript-1fa5cccc63c5
// Import the framework and instantiate it
import Fastify from 'fastify'
import fastifyExpress from '@fastify/express'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'

import routes from './api/index.js'
import { userSchemas } from './api/user/schema.js'

const app = Fastify({
  logger: true
})

// Declare a route
app.register(routes, { prefix: '/' })

await app.register(fastifyExpress)
await app.register(fjwt, { secret: process.env?.JWT_SECRET || 'Veda Bezaleel' })

app.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = app.jwt
  return next()
})
app.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
})

for(let schema of [...userSchemas]) {
  app.addSchema(schema)
}

// Run the server!
try {
  await app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}