import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

import { CreateUserSchema, createUserSchema, LoginUserSchema, loginUserSchema, userSchemas } from "./schema.js";
import { createUser, getUserByEmail, getUserByName } from "../../service/prisma/user.js";
import { addTokenByUserId } from "../../service/prisma/token.js";

export async function testHandler(req: FastifyRequest, res: FastifyReply) {
    return res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ hello: "world!" });
  }

export async function loginController(req: FastifyRequest<{ Body: LoginUserSchema }>, res: FastifyReply) {
  loginUserSchema.safeParse(req.body)
  const { email, username, password } = req.body
  const exp = new Date( Date.now() + 1000 * 60 * 60 * 24 * 7)
  
  const user = email ?
    await getUserByEmail({ email })
    : username ?
      await getUserByName({ username })
      : undefined

  const isMatch = user && (await bcrypt.compare(password, user.password))
  if (!user || !isMatch) {
    return res.code(401).send({
      message: 'Invalid email or password.',
    })
  }

  const token = req.jwt.sign({
    id: user.id,
    username: user.username,
  })

  await addTokenByUserId({ iduserId: user.id, token, exp})

  return res.code(200).send({
    message: 'Login success.',
    data: {
      accessToken: token
    }
  }).setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: exp
  })
}

export async function createUserController(req: FastifyRequest<{ Body: CreateUserSchema }>, res: FastifyReply) {
  createUserSchema.safeParse(req.body)

  const { email, username, password, status } = req.body;
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10)
  const exp = new Date( Date.now() + 1000 * 60 * 60 * 24 * 7)

  const user = await createUser({ id, username, email, password: hashedPassword, status})

  const token = req.jwt.sign({
    id: user.id,
    username: user.username,
  })

  await addTokenByUserId({ userId: user.id, token, exp})

  return res.code(201).send({
    message: "User created.",
    data: {
      user,
      accessToken: token
    }
  }).setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: exp
  })
}

export async function logoutController(req: FastifyRequest, res: FastifyReply) {
  res.setCookie('access_token', 'invalid', {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: new Date( Date.now() )
  })
}