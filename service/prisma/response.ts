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