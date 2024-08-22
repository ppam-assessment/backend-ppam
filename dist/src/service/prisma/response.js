import prisma from "../../config/prisma.js";
export const addUserResponses = async ({ data }) => {
    const responses = await prisma.responses.createMany({
        data
    });
    return responses;
};
export const readUserResponses = async ({ userId, topicId }) => {
    const responses = await prisma.instrument.findMany({
        where: {
            number: {
                not: null,
            },
            topicId
        },
        select: {
            id: true,
            topicId: true,
            number: true,
            type: true,
            question: true,
            respons: {
                where: {
                    userId
                },
                select: {
                    value: true,
                    comment: true
                }
            },
            sub: {
                select: {
                    id: true,
                    question: true,
                    type: true,
                    respons: {
                        where: {
                            userId
                        },
                        select: {
                            value: true,
                            comment: true
                        }
                    }
                }
            },
            choice: {
                select: {
                    value: true
                }
            }
        },
        orderBy: {
            number: 'asc'
        }
    });
    return responses;
};
export const deleteUserResponsesByInstrumentId = async ({ userId, instrumentId }) => {
    const result = await prisma.responses.deleteMany({
        where: {
            instrumentId: {
                in: instrumentId
            }
        }
    });
    return result;
};
