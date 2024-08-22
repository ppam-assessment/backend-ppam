import { inputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { InstrumentType, Status } from "@prisma/client";
import { addUserResponses, deleteUserResponsesByInstrumentId, readUserResponses } from "../../service/prisma/response.js";
export async function postUserResponseController(req, res) {
    const session = await req.jwtVerify();
    const { user } = await getSessionUser({ id: session.id });
    if (!user) {
        return Error("User not found.");
    }
    else if (user.status !== Status.submitter) {
        return Error("User doesn't have access.");
    }
    inputResponseSchema.safeParse(req.body);
    const inputArr = req.body;
    const instrumentIdList = inputArr.reduce((result, item) => {
        result.push(item.instrumentId);
        return result;
    }, []);
    await deleteUserResponsesByInstrumentId({ userId: user.id, instrumentId: instrumentIdList });
    const input = inputArr.map(data => {
        return {
            userId: user.id,
            instrumentId: data.instrumentId,
            value: data.value,
            score: data.score,
            comment: data.comment
        };
    });
    const responses = await addUserResponses({ data: input });
    return res.code(200).send({
        message: `Data added for ${user.username}.`,
        data: responses
    });
}
export async function getUserResponsesController(req, res) {
    const session = await req.jwtVerify();
    const { user } = await getSessionUser({ id: session.id });
    if (!user) {
        return Error("User not found.");
    }
    else if ((user.status !== Status.submitter) || (session.username !== user.username)) {
        return Error("User doesn't have access.");
    }
    const { topic } = req.query;
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
                };
            }) : undefined
        };
    });
    return res.code(200).send({
        message: `Data added for ${user.username}.`,
        data: responses
    });
}
