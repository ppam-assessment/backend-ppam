import prisma from "../../config/prisma.js";

export const getAllInstrument = async ({from, to}: {from: number | undefined, to: number | undefined}) => {
    const whereCondition: any = {};

    if (from !== null && to !== null) {
        whereCondition.number = {
            gte: from,
            lte: to
        };
    }

    const instrument = await prisma.instrument.findMany({
        where: whereCondition,
        select: {
            id: true,
            topicId: true,
            number: true,
            type: true,
            question: true,
            sub: {
                select: {
                    id: true,
                    question: true,
                    type: true,
                    choice: {
                        select: {
                            // id: true,
                            value: true // split by %2$
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

    })

    return instrument;
}

export const getResponseByUserId = async ({ userId }: { userId: string }) => {
    const responses = await prisma.instrument.findMany({
        select: {
            id: true,
            topicId: true,
            number: true,
            type: true,
            question: true,
            sub: {
                select: {
                    id: true,
                    question: true,
                    type: true,
                    respons: {
                        select: {
                            value: true
                        }
                    }
                }
            },
            respons: {
                select: {
                    value: true
                },
                where: {
                    userId
                }
            }
        },
    })


    return responses;
}

