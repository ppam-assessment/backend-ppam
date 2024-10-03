import { InstrumentType } from "@prisma/client";
import prisma from "../../config/prisma.js";
import { number } from "zod";

export const getAllInstrument = async ({from, to}: {from: number | undefined, to: number | undefined}) => {
    const whereCondition = {
        number: {
            not: null,
            gte: from,
            lte: to
        },
        
    };

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
                }
            },
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

export const updateInstrumentsQuestion = async ({ data }: { data: { id: number, question: string }[] }) => {
    await Promise.all([
        data.forEach(record => {
            prisma.instrument.update({
                where: {
                    id: record.id
                },
                data: {
                    question: record.question
                }
                // create: {
                //     id: record.id,
                //     question: record.question,
                //     mainId: record.mainId,
                //     number: record.number,
                //     type: record?.type || InstrumentType.text,
                //     topicId: record?.topicId || 0
                // }
            })
        })
    ])

    return 1;
}