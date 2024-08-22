import prisma from "../../config/prisma.js";
export const readAreaChoices = async () => {
    return await prisma.areas.findMany({
        orderBy: {
            type: 'asc'
        },
        select: {
            type: true,
            name: true
        }
    });
};
