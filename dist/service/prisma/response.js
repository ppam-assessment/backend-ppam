import prisma from "../../config/prisma.js";
export const addUserResponses = async ({ data }) => {
    const responses = await prisma.responses.createMany({
        data
    });
    return responses;
};
export const readUserResponses = async ({ userId, topicId }) => {
    const whereCondition = topicId ? {
        userId,
        topicId
    } : {
        userId
    };
    const responses = await prisma.responses.findMany({
        where: whereCondition,
        select: {
            instrument: {
                select: {
                    id: true,
                    topicId: true,
                    question: true,
                    type: true
                }
            },
            value: true,
            score: true,
            comment: true
        }
    });
    return responses;
};
