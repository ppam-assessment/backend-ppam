import { Status } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const getUserByEmail = async ({ email }: { email: string }) => {
    const user = await prisma.users.findFirst({
        where: {
            email
        }
    })

    return user;
}

export const getUserByName = async ({ username }: { username: string }) => {
    const user = await prisma.users.findFirst({
        where: {
            username
        }
    })

    return user;
}

export const createUser = async ({ id, username,  institute, email, password, status = Status.viewer }: { id: string, username: string, institute: string | undefined , email: string, password: string, status: Status }) => {
    const user = await prisma.users.create({
        data: {
            id,
            username,
            institute,
            email,
            password,
            status
        }
    })

    return user;
}

export const validateUserRole = async ({ id, status}: {id: string, status: Status}) => {
    const user = await prisma.users.findFirstOrThrow({
        where: {
            id,
            status
        }
    })

    if (user?.id) {
        return true;
    } else {
        return false
    }
}

export const createViewerAccess = async ({userId}: {userId: string}) => {
    const access = await prisma.viewerAccess.create({
        data: {
            id: userId
        }
    })

    return access;
}