import prisma from "../../config/prisma.js";

export const readAreaChoices = async () => {
    return await prisma.areas.groupBy({
        by: ['type']
    })
}