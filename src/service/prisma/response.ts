import prisma from "../../config/prisma.js";

export const addUserResponses = async ({ data }: {
    data: {
        userId: string,
        instrumentId: number,
        value: string,
        score: number
        comment: string
    }[]
}) => {
    const responses = await prisma.responses.createMany({
        data
    })

    return responses;
}

export const readUserResponses = async ({ userId, topicId }: { userId?: string, topicId?: number | undefined }) => {

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
            topic: {
                select: {
                    topic: true,
                    part: true
                }
            }
        },
        orderBy: {
            number: 'asc'
        }
    })

    return responses;
}

export const deleteUserResponsesByInstrumentId = async({userId, instrumentId}: { userId: string, instrumentId: number[]}) => {
    const result = await prisma.responses.deleteMany({
        where: {
            instrumentId: {
                in: instrumentId
            }
        }
    })

    return result;
}

// export const readProvinceOnlyResponse = async () => {
//     const result = await prisma.users.findMany({
//         where: {
//             metadata: {
//                 cityId: null,
//                 NOT: {
//                     provinceId: null
//                 }
//             },
//             response: {
                
//             }
//         },
//         select: {
//             response: {
                
//             }
//         }
//     })
// }

export const readResponsesScoreData = async () => {
    const responses = await prisma.responses.findMany({
      where: {
        responder: {
          metadata: {
            provinceId: {
              not: null,
            },
            cityId: null,
          },
        },
        instrument: {
          type: {
            in: ["dropdown", "dropdownya", "dropdownideal", "dropdownarea"],
          },
        },
        value: {
          in: ["Ya", "Tidak", "Tidak Tahu", "Ideal", "Minimal Diperlukan", "Tidak Memadai"],
        },
      },
      select: {
        value: true,
        instrumentId: true, // Dibutuhkan untuk menghitung jumlah instrumen unik
        responder: {
          select: {
            metadata: {
              select: {
                province: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        instrument: {
          select: {
            topic: {
              select: {
                topic: true,
                part: true,
              },
            },
          },
        },
      },
    });
  
    return responses;
  };
  
  