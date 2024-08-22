import prisma from "../../config/prisma.js";

export const addSession = async ({ id, userId, token, exp }: { id: string, userId: string, token: string, exp: Date }) => {
    const session = await prisma.sessions.create({
        data: {
            id,
            userId,
            token,
            exp
        }
    })

    // await deleteAllExpiredSession()

    return session;
}

export const getSession = async ({ id }: { id: string }) => {
    const session = await prisma.sessions.findUniqueOrThrow({
        where: {
            id
        }
    })

    return session;
}

export const getSessionUser = async ({ id }: { id: string }) => {
    const session = await prisma.sessions.findUniqueOrThrow({
        select: {
            user: true
        },
        where: {
            id
        }
    })

    return session;
}

export const deleteSessionById = async ({ id }: { id: string }) => {
    await prisma.sessions.delete({
        where: {
            id
        }
    })
}

export const deleteAllSessionByUserId = async ({ userId }: { userId: string }) => {
    await prisma.sessions.deleteMany({
        where: {
            userId
        }
    })
}

export const deleteAllExpiredSession = async () => {
    await prisma.sessions.deleteMany({
        where: {
            exp: {
                gt: new Date(Date.now())
            }
        }
    })
}