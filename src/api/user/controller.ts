import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserSchema, createUserSchema, LoginUserSchema, loginUserSchema } from "./schema.js";
import { createUser, getUserByEmail, getUserByName } from "../../service/prisma/user.js";
import { addSession } from "../../service/prisma/session.js";
import getNextDay from "../../utils/lib/timePeriod.js";

export async function loginController(req: FastifyRequest<{ Body: LoginUserSchema }>, res: FastifyReply) {
  loginUserSchema.safeParse(req.body)
  const { email, username, password } = req.body
  const exp = await getNextDay()
  const sessionId = uuidv4();

  const user = email ?
    await getUserByEmail({ email })
    : username ?
      await getUserByName({ username })
      : undefined

  const isMatch = user && bcrypt.compareSync(password, user.password);
  if (!user || !isMatch) {
    return res.code(401).send({
      message: 'Invalid email or password.',
    })
  }

  const token = req.jwt.sign({
    id: sessionId,
    username: user.username,
    institute: user?.institute || undefined,
    status: user.status,
  })

  await addSession({ id: sessionId, userId: user.id, token, exp })

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

  const { email, username, password, status, institute } = req.body;
  const id = uuidv4();
  const sessionId = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const exp = await getNextDay()

  const user = await createUser({ id, username, institute, email, password: hashedPassword, status })

  const token = req.jwt.sign({
    id: sessionId,
    username: user.username,
    institute: user?.institute || undefined,
    status: user.status,
  })

  await addSession({ id: sessionId, userId: user.id, token, exp })

  return res.code(201).send({
    message: "User created.",
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

export async function logoutController(req: FastifyRequest, res: FastifyReply) {
  res.setCookie('access_token', 'invalid', {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now())
  })
}