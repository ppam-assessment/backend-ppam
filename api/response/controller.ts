import { FastifyReply, FastifyRequest } from "fastify";
import { inputResponse, InputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { Status } from "@prisma/client";
import { addUserResponses } from "../../service/prisma/response.js";

export async function postUserResponse(req: FastifyRequest<{ Body: InputResponseSchema }>, res: FastifyReply) {
      const session = await req.jwtVerify() as TokenPayload

    const {user} = await getSessionUser({id: session.id})
    if (!user) {
        return Error("User not found.");
    }else if(user.status !== Status.institute){
      return Error("User doesn't have access.");
    }

  inputResponse.safeParse(req.body)
  const inputArr = req.body

  const input = inputArr.map( data => { return {
    userId: user.id,
    instrumentId: data.instrumentId,
    value: data.value,
    score: data?.score,
    comment: data.comment
  }}) as InputResponseSchema

  const responses = await addUserResponses({data: input})

  return res.code(200).send({
    message: `Data added for ${user.username}.`,
    data: responses
  })
}