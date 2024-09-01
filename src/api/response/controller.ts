import { FastifyReply, FastifyRequest } from "fastify";
import {  inputResponseSchema, InputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, InstrumentType, Status } from "@prisma/client";
import { addUserResponses, deleteUserResponsesByInstrumentId, readUserResponses } from "../../service/prisma/response.js";
import { readViewerAccessByUserId } from "../../service/prisma/viewerAccess.js";
import { readAllResponseMetadata } from "../../service/prisma/responseMetadata.js";

export const postUserResponseController = async (req: FastifyRequest<{ Body: InputResponseSchema }>, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload

  const { user } = await getSessionUser({ id: session.id })

  if (!user) {
    return Error("User not found.");
  } else if (user.status !== Status.submitter) {
    return Error("User doesn't have access.");
  }

  inputResponseSchema.safeParse(req.body)
  const inputArr = req.body

  const instrumentIdList = inputArr.reduce( (result: number[], item) => {
    result.push(item.instrumentId)
    return result
  }, [])
  await deleteUserResponsesByInstrumentId({userId: user.id, instrumentId: instrumentIdList})

  const input = inputArr.map(data => {
    const { instrumentId, value, multivalue, score, comment} = data

    return {
      userId: user.id,
      instrumentId: instrumentId,
      value: multivalue?.toString() || value,
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

  const { user } = await getSessionUser({ id: session.id })
  if (!user) {
    return Error("User not found.");
  } else if ( (user.status !== Status.submitter) || (session.username !== user.username) ) {
    return Error("User doesn't have access.");
  }

  const { topic } = req.query as { topic?: string };
  const topicId = topic ? parseInt(topic, 10) : undefined;

  const responses = (await readUserResponses({ userId: user.id, topicId })).map( item => {
    return {
      id: item.id,
      number: item.number,
      question: item.question,
      value: item.respons[0]?.value,
      comment: item.respons[0]?.comment,
      sub: item.type === InstrumentType.sub ? item.sub.map( subItem => {
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
    message: `Data added for ${user.username}.`,
    data: responses
  })
}

export const getAllResponse = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload

  const { user } = await getSessionUser({ id: session.id })

  if (!user) {
    return Error("User not found.");
  } else if (user.status === Status.viewer) {
    const access = await readViewerAccessByUserId({userId: user.id})
    if (access?.status !== accessStatus.approved) return Error("User doesn't have access.")
  } else if (user.status === Status.submitter) {
    return Error("User doesn't have access.");
  }

  const responses = await readAllResponseMetadata()
  responses.map( response => {
    return {
      submitter: response.responder.username,
      leader: response.leader,
      date: response.date,
      area: response.area.name,
      participants: response.participants
    }
  })

  return res.send({
    message: 'success.',
    data: responses
  })
}

export const getUserResponseByUsername = async(req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id })
  const { username } = req.params as { username: string }

  if (!user) {
    return Error("User not found.");
  } else if (user.status === Status.viewer) {
    const access = await readViewerAccessByUserId({userId: user.id})
    if (access?.status !== accessStatus.approved) return Error("User doesn't have access.")
  } else if (user.status === Status.submitter) {
    return Error("User doesn't have access.");
  }

  const response = await readUserResponses({username});
  response.map( item => {
    return {
      id: item.id,
      number: item.number,
      question: item.question,
      value: item.respons[0]?.value,
      comment: item.respons[0]?.comment,
      sub: item.type === InstrumentType.sub ? item.sub.map( subItem => {
        return {
          id: subItem.id,
          question: subItem.question,
          value: subItem.respons[0]?.value,
          comment: subItem.respons[0]?.comment,    
        }
      }) : undefined
    }
  })

  return res.send({
    message: 'success.',
    data: response
  })
}