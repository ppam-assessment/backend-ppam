import prisma from "../../config/prisma.js"

export const readAllResponseMetadata = async () => {
    const listResponse = await prisma.responseMetadata.findMany({
        select: {
            id: true,
            leader: true,
            participants: true,
            date: true,
            area: {
                select: {
                    name: true
                }
            },
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

export const createResponseMetadata = async({userId, areaId, leader, date, participant}: {userId: string, areaId: number, leader: string, date: Date, participant: string}) => {
    const metadata = await prisma.responseMetadata.create({
        data: {
            userId,
            areaId,
            leader,
            date,
            participants: participant
        }
    })

    return metadata;
}