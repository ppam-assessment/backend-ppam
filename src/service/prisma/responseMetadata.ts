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