import { inputResponseSchema } from "./schema.js";
import { getSessionUser } from "../../service/prisma/session.js";
import { Status } from "@prisma/client";
import { addUserResponses, readUserResponses } from "../../service/prisma/response.js";
export async function postUserResponseController(req, res) {
    const session = await req.jwtVerify();
    // return res.send({session})
    const { user } = await getSessionUser({ id: session.id });
    // console.log(`\n\nlog: ${session.id}\n\n`)
    if (!user) {
        return Error("User not found.");
    }
    else if (user.status !== Status.institute) {
        return Error("User doesn't have access.");
    }
    inputResponseSchema.safeParse(req.body);
    const inputArr = req.body;
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
    else if ((user.status !== Status.institute) || (session.username !== user.username)) {
        return Error("User doesn't have access.");
    }
    const { topic } = req.query;
    const topicId = topic ? parseInt(topic, 10) : undefined;
    const responses = await readUserResponses({ userId: user.id, topicId });
    return res.code(200).send({
        message: `Data added for ${user.username}.`,
        data: responses
    });
}
