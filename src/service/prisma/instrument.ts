import { InstrumentType } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const getAllInstrument = async ({ from, to }: { from: number | undefined, to: number | undefined }) => {
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

// export const readInstrumentChoiceType = async () => {
//     const instruments =  await prisma.instrument.groupBy({
//       by: ["topicId"],
//       where: {
//         type: {
//           in: [ "dropdownya", "dropdownideal" ],
//         },
//         topicId: {
//             not: 0
//         }
//       },
//       _count: {
//         question:true
//       },
//       orderBy: {
//         topicId: 'asc'
//       }
//     });

//     return instruments;
//   };

// export const readInstrumentChoiceType = async() => {
//     const instrument = await prisma.instrument.findMany({
//         where: {

//         }
//     })
// }

export const readInstrumentChoiceTypeByTopic = async () => {
    const InstrumentCount = await prisma.topics.findMany({
        where: {
            NOT: {
                id: 0
            }
        },
        select: {
            id: true,
            _count: {
                select: {
                    instrument: {
                        where: {
                            type: {
                                in: [InstrumentType.dropdownya, InstrumentType.dropdownideal]
                            }
                        },
                    }
                }
            }
        }
    })

    return InstrumentCount
}