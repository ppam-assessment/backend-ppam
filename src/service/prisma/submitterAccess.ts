import { accessStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const readAllSubmitterAccess = async () => {
    const access = await prisma.submitterAccess.findMany({
        select: {
            status: true,
            reason: true,
            rejectReason: true,
            date: true,
            submitter: {
                select: {
                    username: true
                }
            }
        }
    })

    return access;
}

export const readSubmitterAccessByUserId = async ({userId}: {userId: string}) => {
    const access = await prisma.submitterAccess.findFirst({
        where: {
            userId
        },
        select: {
            id: true,
            status: true,
            reason:true,
            date: true,
            rejectReason: true
        }
    })

    return access;
}

export const createSubmitterAccess = async ({userId, reason}: {userId: string, reason: string | undefined}) => {
    const access = await prisma.submitterAccess.create({
        data: {
            userId,
            reason
        }
    })

    return access;
}

export const updateSubmitterAccess = async ({userId, status, reason, rejectReason}: {userId: string, status: accessStatus, reason?: string | undefined, rejectReason?: string | undefined}) => {
    const access = await prisma.submitterAccess.update({
        where: {
            userId
        },
        data: {
            status,
            reason,
            rejectReason
        },
    })

    return access;
}