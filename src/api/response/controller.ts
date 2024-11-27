import { FastifyReply, FastifyRequest } from "fastify";
import { InputMetadataSchema, inputResponseSchema, InputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Prisma, Status } from "@prisma/client";
import { addUserResponses, deleteUserResponsesByInstrumentId, readResponsesScoreData, readUserResponses } from "../../service/prisma/response.js";
import { readViewerAccess, readViewerAccessByUserId } from "../../service/prisma/viewerAccess.js";
import { createResponseMetadata, readAllResponseMetadata, readResponseMetadataByUserId, readResponseMetadataByUsername, updateResponseMetadata } from "../../service/prisma/responseMetadata.js";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { readUserByUsername } from "../../service/prisma/user.js";
import groupResponsesByTopic from "../../utils/lib/groupResponsesByTopic.js";
import { mapResponses, mapXlsResponses } from "../../utils/lib/mapResponses.js";
import { readInstrumentsCountByTopicPart } from "../../service/prisma/instrument.js";
import { mapProvinceScores } from "../../utils/lib/mapProvinceScores.js";

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

  const responses = await readUserResponses({ userId: user.id, topicId })

  const mappedResponses = mapResponses(responses)

  const groupedResponses = groupResponsesByTopic(mappedResponses);

  const metadata = await readResponseMetadataByUserId({userId: user.id})
  const mappedMetadata = {
    leader: metadata?.leader,
    date: metadata?.date,
    area: !metadata?.province ? `Nasional` : `Subnasional${metadata.province ? ',' + metadata?.province.name : ''}, ${metadata?.city ? ',' + metadata?.city?.name : ''}`,
    participants: metadata?.participants
  }

  return res.code(200).send({
    message: `Data added for ${user.username}.`,
    data: {
      metadata: mappedMetadata,
      responses: groupedResponses
    }
  })
}

export const getResponseMetadata = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  let accessCityIds: (number | null)[] | undefined = undefined, accessProvinceIds: (number | null)[] | undefined = undefined

  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if (user.status === Status.viewer) {
    const access = await readViewerAccessByUserId({ userId: user.id })
    if (access.length === 0) throw new Forbidden("User doesn't have access.")

    accessCityIds = access.map( record => {
      return record.cityId
    })
    accessProvinceIds = access.map( record => {
      return record.provinceId
    })
  } else if (user.status === Status.submitter) {
    throw new Forbidden("User doesn't have access.");
  }

  const responseMetadataArg = { cityIds: accessCityIds?.filter((id): id is number => id !== null) , provinceIds: accessProvinceIds?.filter((id): id is number => id !== null) }
  const responses = await readAllResponseMetadata(responseMetadataArg)
  const mappedResponses = responses.map(response => {
    const { province, city } = response;

    const area = !province ? 'Nasional' : `Subnasional, ${province}, ${city || ''}`
    return {
      submitter: response.responder.username,
      leader: response.leader,
      date: response.date,
      area,
      areaId:{
        cityId: response?.city?.id || null,
        provinceId: response?.province?.id || null
      },
      participants: response.participants
    }
  })

  return res.code(200).send({
    message: 'success.',
    data: {
      responses: mappedResponses
    }
  })
}

export const getUserResponseByUsername = async (req: FastifyRequest, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })
  const { username } = req.params as { username: string }
  const { xls } = req.query as { xls?: string}
  const isXls = xls === 'true'

  let mappedResponses, grouppedResponses
  const metadata = await readResponseMetadataByUsername({username: username})

  if (user.status === Status.viewer) {
    const access = await readViewerAccess({ userId: user.id, cityId: metadata?.city?.id, provinceId: metadata?.province?.id })
    if (access?.status !== accessStatus.approved) throw new Forbidden("User doesn't have access.")
  } else if (user.status === Status.submitter && user.username !== username) {
    throw new Forbidden("User doesn't have access.");
  }

  const submitter = await readUserByUsername({ username }).catch(() => { throw new NotFound(`Submitter ${username} not found.`) })

  const response = await readUserResponses({ userId: submitter.id });

  if (isXls) {
    mappedResponses = mapXlsResponses(response)
  } else {
    mappedResponses = mapResponses(response);
    grouppedResponses = groupResponsesByTopic(mappedResponses)

  }

  const mappedMetadata = {
      leader: metadata?.leader,
      date: metadata?.date,
      area: !metadata?.province ? `Nasional` : `Subnasional, ${metadata?.province?.name}, ${metadata?.city?.name || ''}`,
      participants: metadata?.participants
    }

  return res.code(200).send({
    message: 'success.',
    data: {
      metadata: mappedMetadata,
      responses: grouppedResponses
    }
  })
}

export const postSubmitterMetadata = async (req: FastifyRequest<{ Body: InputMetadataSchema }>, res: FastifyReply) => {
  const session = await req.jwtVerify() as TokenPayload
  const { user } = await getSessionUser({ id: session.id }).catch(() => {
    throw new NotFound("User not found.")
  })

  if (user.status !== Status.submitter) throw new Forbidden("User doesn't have access.")

  const { leader, date, participant, provinceId, cityId } = req.body

  if (user.status !== Status.submitter) throw new Forbidden("User doesn't have access.");

  await createResponseMetadata({ userId: user.id, provinceId, cityId, leader, participant, date })
    .catch(async e => {
      const isPrismaErr = e instanceof Prisma.PrismaClientKnownRequestError
      const isUserIdErr = e.message.includes('userId')

      if (isPrismaErr && isUserIdErr) {
        await updateResponseMetadata({ userId: user.id, provinceId, cityId, leader, date, participant })
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

export const getResponseScore = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch(() => {
      throw new NotFound("User not found.")
    })
  
    const provinceScores = await readResponsesScoreData();

    const instrumentCounts = await readInstrumentsCountByTopicPart();

    const mappedScores = mapProvinceScores(provinceScores, instrumentCounts);

    return res.code(200).send({
      message: "Province scores successfully retrieved and mapped.",
      data: { 
        provinceScores, 
        instrumentCounts, 
        mappedScores 
      },
    });
  } catch (error) {

    return res.code(500).send({
      message: "Failed to retrieve province scores.",
      error,
    });
  }
};
