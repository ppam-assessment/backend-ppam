import prisma from "../../config/prisma.js";

export const addTokenByUserId = async ({userId, token, exp}: {userId: string, token: string, exp: Date}) => {
    const session = await prisma.session_tokens.create({
        data: {
            userId,
            token,
            exp
        }
    })

    prisma.session_tokens.deleteMany({
        where: {
            exp: {
                gt: new Date( Date.now() )
            }
        }
    })

    return session;
}