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
        orderBy: [{
            topicId: 'asc'
        },
        {
            number: 'asc'
        }]
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

export const updateInstrumentQuestion = async ({ id, question }: { id: number, question: string }) => {
    await prisma.instrument.updateMany({
        where: {
            id
        },
        data: {
            question
        }
    })

    return 1;
}

export const readInstrumentsCountByTopicPart = async () => {
    const instruments = await prisma.instrument.groupBy({
      by: ["topicId"],
      where: {
        type: {
          in: ["dropdown", "dropdownya", "dropdownideal", "dropdownarea"],
        },
        topicId: {
            not: 0
        }
      },
      _count: {
        _all: true, // Menghitung jumlah instrumen
      },
    });

    await prisma.topics.findMany({
        select: {
            part: true,
            _count: {
                select: {
                    instrument: true
                }
            }
        }
    })
  
    return instruments;
  };
  