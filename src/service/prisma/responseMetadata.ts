import prisma from "../../config/prisma.js"

export const readAllResponseMetadata = async () => {
    const listResponse = await prisma.responseMetadata.findMany({
        select: {
            id: true,
            leader: true,
            participants: true,
            date: true,
            area: true,
            responder: {
                select: {
                    username: true
                }
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

export const createResponseMetadata = async({userId, area, leader, date, participant}: {userId: string, area: string, leader: string, date: Date, participant: string}) => {
    const metadata = await prisma.responseMetadata.create({
        data: {
            userId,
            area,
            leader,
            date,
            participants: participant
        }
    })

    return metadata;
}

export const readResponseMetadataByUserId = async({userId}: {userId: string}) => {
    const metadata = await prisma.responseMetadata.findFirst({
        select: {
            leader: true,
            date: true,
            participants: true,
            area: true
        },
        where: {
            userId
        }
    })

    return metadata
}