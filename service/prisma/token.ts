import prisma from "../../config/prisma.js";

export const addTokenByUserId = async ({id, userId, token, exp}: {id: string, userId: string, token: string, exp: Date}) => {
    const session = await prisma.sessions.create({
        data: {
            id,
            userId,
            token,
            exp
        }
    })

    prisma.sessions.deleteMany({
        where: {
            exp: {
                gt: new Date( Date.now() )
            }
        }
    })

    return session;
}