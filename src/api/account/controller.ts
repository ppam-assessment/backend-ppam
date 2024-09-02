import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserSchema, createUserSchema, LoginUserSchema, loginUserSchema } from "./schema.js";
import { blockUser, createUser, getUserByEmail, getUserByName, readAllUserByStatus } from "../../service/prisma/user.js";
import { addSession, getSessionUser } from "../../service/prisma/session.js";
import getNextDay from "../../utils/lib/timePeriod.js";
import { Status } from "@prisma/client";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { BadRequest } from "../../exceptions/BadRequest.js";

export const loginController = async (req: FastifyRequest<{ Body: LoginUserSchema }>, res: FastifyReply) => {
  loginUserSchema.safeParse(req.body)
  const { email, username, password } = req.body
  const exp = await getNextDay()
  const sessionId = uuidv4();

  const user = email ?
    await getUserByEmail({ email })
    : username ?
      await getUserByName({ username })
      : undefined

      if(!user) throw new BadRequest("Invalid email or username.")
  const isMatch = user && bcrypt.compareSync(password, user.password);
  if (!isMatch) throw new BadRequest("Invalid password.")

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

export const createUserController = async (req: FastifyRequest<{ Body: CreateUserSchema }>, res: FastifyReply) => {
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

export const logoutController = async(req: FastifyRequest, res: FastifyReply) => {
  return res.setCookie('access_token', 'invalid', {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now())
  })
}

export const putUserStatusBlocked = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id })

  if (!user) {
      throw new NotFound("User not found.");
  } else if (user.status !== Status.admin) {
      throw new Forbidden("User doesn't have access.");
  }

  const { username } = req.params as { username: string }

  await blockUser({ username })

  return res.send({
    message: `User ${user.username} has been blocked.`
  })
}

export const getAllUsers = async (req: FastifyRequest, res: FastifyReply) => {
  const { admin, submitter, viewer, blocked } = req.query as getAllUsersParams

  const users = await readAllUserByStatus({ admin, submitter, viewer, blocked})

  return res.send({
    message: 'Success.',
    data: users
  })
}