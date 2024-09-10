import { FastifyReply, FastifyRequest } from "fastify";
import { InputMetadataSchema, inputResponseSchema, InputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, InstrumentType, Prisma, Status } from "@prisma/client";
import { addUserResponses, deleteUserResponsesByInstrumentId, readUserResponses } from "../../service/prisma/response.js";
import { readViewerAccessByUserId } from "../../service/prisma/viewerAccess.js";
import { createResponseMetadata, readAllResponseMetadata, readResponseMetadataByUserId, updateResponseMetadata } from "../../service/prisma/responseMetadata.js";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { readUserByUsername } from "../../service/prisma/user.js";

export const postUserResponseController = async (req: FastifyRequest<{ Body: InputResponseSchema }>, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload

  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if (user.status !== Status.submitter) {
    throw new Forbidden("User doesn't have access.");
  }

  inputResponseSchema.safeParse(req.body)
  const inputArr = req.body

  const instrumentIdList = inputArr.reduce((result: number[], item) => {
    result.push(item.instrumentId)
    return result
  }, [])
  await deleteUserResponsesByInstrumentId({ userId: user.id, instrumentId: instrumentIdList })

  const input = inputArr.map(data => {
    const { instrumentId, value, score, comment } = data

    return {
      userId: user.id,
      instrumentId: instrumentId,
      value: value.toString(),
      score: score,
      comment: comment
    };
  }) as {
    userId: string,
    instrumentId: number,
    value: string,
    score: number,
    comment: string
  }[]

  const responses = await addUserResponses({ data: input })

  return res.code(200).send({
    message: `Data added for ${user.username}.`,
    data: responses
  })
}

export const getUserResponsesController = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload

  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if ((user.status !== Status.submitter) || (session.username !== user.username)) {
    throw new Forbidden("User doesn't have access.");
  }

  const { topic } = req.query as { topic?: string };
  const topicId = topic ? parseInt(topic, 10) : undefined;

  const responses = (await readUserResponses({ userId: user.id, topicId })).map(item => {
    return {
      id: item.id,
      number: item.number,
      question: item.question,
      value: item.respons[0]?.value,
      comment: item.respons[0]?.comment,
      sub: item.type === InstrumentType.sub ? item.sub.map(subItem => {
        return {
          id: subItem.id,
          question: subItem.question,
          value: subItem.respons[0]?.value,
          comment: subItem.respons[0]?.comment,
        }
      }) : undefined
    }
  })

  const metadata = await readResponseMetadataByUserId({userId: user.id})

  return res.code(200).send({
    message: `Data added for ${user.username}.`,
    data: {
      metadata,
      responses
    }
  })
}

export const getResponseMetadata = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload

  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if (user.status === Status.viewer) {
    const access = await readViewerAccessByUserId({ userId: user.id })
    if (access?.status !== accessStatus.approved) throw new Forbidden("User doesn't have access.")
  } else if (user.status === Status.submitter) {
    throw new Forbidden("User doesn't have access.");
  }

  const responses = await readAllResponseMetadata()
  responses.map(response => {
    return {
      submitter: response.responder.username,
      leader: response.leader,
      date: response.date,
      area: response.area,
      participants: response.participants
    }
  })

  return res.code(200).send({
    message: 'success.',
    data: responses
  })
}

export const getUserResponseByUsername = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })
  const { username } = req.params as { username: string }

  if (user.status === Status.viewer) {
    const access = await readViewerAccessByUserId({ userId: user.id })
    if (access?.status !== accessStatus.approved) throw new Forbidden("User doesn't have access.")
  } else if (user.status === Status.submitter) {
    throw new Forbidden("User doesn't have access.");
  }

  const submitter = await readUserByUsername({ username }).catch(() => { throw new NotFound(`Submitter ${username} not found.`) })

  const response = await readUserResponses({ userId: submitter.id });
  response.map(item => {
    return {
      id: item.id,
      number: item.number,
      question: item.question,
      value: item.respons[0]?.value,
      comment: item.respons[0]?.comment,
      sub: item.type === InstrumentType.sub ? item.sub.map(subItem => {
        return {
          id: subItem.id,
          question: subItem.question,
          value: subItem.respons[0]?.value,
          comment: subItem.respons[0]?.comment,
        }
      }) : undefined
    }
  })

  return res.code(200).send({
    message: 'success.',
    data: response
  })
}

export const postSubmitterMetadata = async (req: FastifyRequest<{ Body: InputMetadataSchema }>, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if (user.status !== Status.submitter) throw new Forbidden("User doesn't have access.")

  const { area, leader, date, participant } = req.body

  if (user.status !== Status.submitter) throw new Forbidden("User doesn't have access.");

  await createResponseMetadata({ userId: user.id, area, leader, participant, date })
    .catch(async e => {
      const isPrismaErr = e instanceof Prisma.PrismaClientKnownRequestError
      const isUserIdErr = e.message.includes('userId')

      if (isPrismaErr && isUserIdErr) {
        await updateResponseMetadata({ userId: user.id, area, leader, date, participant })
        return res.code(200).send({
          message: `Response metadata updated for ${user.username}.`,
        })
      }
      throw e
    });

  res.code(201).send({
    message: `Response metadata created for ${user.username}.`,
  })
}