import prisma from "../../config/prisma.js"

export const readAllResponseMetadata = async ({ provinceIds, cityIds}: {provinceIds?: number[] | null, cityIds?: number[] | null}) => {
    const listResponse = await prisma.responseMetadata.findMany({
        select: {
            id: true,
            leader: true,
            participants: true,
            date: true,
            city: true,
            province: true,
            responder: {
                select: {
                    username: true
                }
            }
        },
        where: {
            provinceId: {
                in: provinceIds
            },
            cityId: {
                in: cityIds
            }
        }
    });

    return listResponse;
}

export const readUserIdByMetadataId = async({metaId}: {metaId: number}) => {
    const userId = await prisma.responseMetadata.findFirstOrThrow({
        where: {
            id: metaId,
        },
        select: {
            userId: true
        }
    })

    return userId;
}

export const createResponseMetadata = async({userId, provinceId, leader, date, participant, cityId}: {userId: string, provinceId: number | undefined, leader: string, date: Date, participant: string, cityId: number | undefined}) => {
    const metadata = await prisma.responseMetadata.create({
        data: {
            userId,
            provinceId,
            cityId,
            leader,
            date,
            participants: participant,
        }
    })

    return metadata;
}

export const readResponseMetadataByUserId = async({userId, }: {userId: string}) => {
    const metadata = await prisma.responseMetadata.findFirst({
        select: {
            leader: true,
            date: true,
            participants: true,
            city: true,
            province: true,
        },
        where: {
            userId,
        }
    })

    return metadata
}

export const readResponseMetadataByUsername = async({username}: {username: string}) => {
    const metadata = await prisma.responseMetadata.findFirst({
        select: {
            leader: true,
            date: true,
            participants: true,
            city: true,
            province: true, 
            },
        where: {
            responder: {
                username: username
            }
        }
    })

    return metadata
}

export const updateResponseMetadata = async({userId, provinceId, leader, date, participant, cityId}: {userId: string, provinceId: number | undefined, leader: string, date: Date, participant: string, cityId: number | undefined}) => {
    const metadata = await prisma.responseMetadata.update({
        where: {
            userId,
        },
        data: {
            provinceId,
            leader,
            date,
            participants: participant,
        }
    })

    return metadata;
}

export const readMetadataScoreValue = async() => {
    const score = await prisma.responseMetadata.findMany({
        where:{
            cityId: null,
            NOT: {
                provinceId: null
            }
        },
        select: {
            responder: {
                select: {
                    response: {
                        where: {
                            value: {
                                in: ['Ya', 'Tidak', 'Tidak Tahu', 'Ideal', 'Minimal Diperlukan', 'Tidak Memadai']
                            }
                        },
                        select: {
                            value: true,
                            instrument: {
                                select: {
                                    topicId: true
                                }
                            }
                        }
                    }
                }
            },
            province: {
                select: {
                    name: true
                }
            }
        },
        distinct: ['provinceId']
    })

    return score
}