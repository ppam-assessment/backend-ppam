import { Prisma, Status } from "@prisma/client";
import prisma from "../../config/prisma.js";
import { Conflict } from "../../exceptions/Conflict.js";
import { Forbidden } from "../../exceptions/Forbidden.js";

const blockedStatus = Status.submitter_blocked || Status.viewer_blocked

export const getUserByEmail = async ({ email }: { email: string }) => {
    const user = await prisma.users.findFirst({
        where: {
            email
        }
    })

    if (user?.status === blockedStatus) throw new Forbidden(`User ${user.username} was blocked.`)

    return user;
}

export const getUserByName = async ({ username }: { username: string }) => {
    const user = await prisma.users.findFirst({
        where: {
            username
        }
    })

    if (user?.status === blockedStatus) throw new Forbidden(`User ${user.username} was blocked.`)

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
    }).catch( e => {
        if ( e instanceof Prisma.PrismaClientKnownRequestError )
            if(e.code === 'P2002') {
                const {message} = e
                
                if(message.includes('username')) throw new Conflict(`Username ${username} already exist.`)
                if(message.includes('email')) throw new Conflict(`Email ${email} already exist`)
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

export const blockUser = async ({ username, status }: { username: string, status: Status }) => {
    let blockStatus: Status
    if (status === Status.viewer) {
        blockStatus = Status.viewer_blocked 
    }else if (status === Status.submitter) {
        blockStatus = Status.submitter_blocked
    }else{
        throw Error('User cannot blocked.')
    }

    const user = await prisma.users.update({
        where: {
            username,
            status: {
                in: [ Status.submitter, Status.viewer ]
            }
        },
        data: {
            status: blockStatus
        }
    })

    return user;
}

export const readAllUserByStatus = async ({ admin, submitter, viewer, blocked }: { admin: boolean | undefined, submitter: boolean | undefined, viewer: boolean | undefined, blocked: boolean | undefined }) => {
    const statusArr = [] as Status[]
    if (admin) statusArr.push(Status.admin)
    if (submitter) statusArr.push(Status.submitter)
    if (viewer) statusArr.push(Status.viewer)
    if (blocked) statusArr.push(blockedStatus)

    const whereCondition = {
        status: {
            in: statusArr
        }
    }

    const users = await prisma.users.findMany({
        where: whereCondition,
        select: {
            username: true,
            institute: true,
            email: true,
            password: true,
            status: true
        }
    })

    return users
}

export const readUserByUsername = async ({ username }: { username: string }) => {

    const user = await prisma.users.findFirstOrThrow({
        where: {
            username
        }
    })

    return user
}