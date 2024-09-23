import prisma from "../../config/prisma.js";

export const readAreaChoices = async () => {
    return await prisma.provinces.findMany({
        orderBy: {
            name:'asc'
        },
        select: {
            id: true,
            name: true,
            Cities: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}