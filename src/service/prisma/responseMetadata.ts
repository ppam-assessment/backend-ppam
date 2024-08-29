import prisma from "../../config/prisma.js"

export const getAllResponseMetadata = async () => {
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
            }
        }
    });

    return listResponse;
}