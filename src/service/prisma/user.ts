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

export const createUser = async ({ id, username, institute, email, password, status = Status.viewer }: { id: string, username: string, institute: string | undefined, email: string, password: string, status: Status }) => {
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

export const validateUserRole = async ({ id, status }: { id: string, status: Status }) => {
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

export const blockUser = async ({ username }: { username: string }) => {
    const user = await prisma.users.update({
        where: {
            username,
            status: {
                notIn: ['admin', 'blocked']
            }
        },
        data: {
            status: Status.blocked
        }
    })

    return user;
}

export const readAllUserByStatus = async ({ admin, submitter, viewer, blocked }: { admin: boolean | undefined, submitter: boolean | undefined, viewer: boolean | undefined, blocked: boolean | undefined }) => {
    const statusArr = [] as Status[]
    if (admin) statusArr.push(Status.admin)
    if (submitter) statusArr.push(Status.submitter)
    if (viewer) statusArr.push(Status.viewer)
    if (blocked) statusArr.push(Status.blocked)

    const whereCondition = {
        status: {
            in: statusArr
        }
    }

    const users = await prisma.users.findMany({
        where: whereCondition
    })

    return users
}