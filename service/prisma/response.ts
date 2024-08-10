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

export const readUserResponses = async ({userId}: {userId: string}) => {
    const responses = await prisma.responses.findMany({
        where: {
            userId
        },
        select: {
            instrument: {
                select: {
                    id: true,
                    question: true,
                    type: true
                }
            },
            value: true,
            score: true,
            comment: true
        }
    })

    return responses;
}