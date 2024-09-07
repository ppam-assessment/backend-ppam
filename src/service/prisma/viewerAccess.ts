import { accessStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const readAllViewerAccess = async () => {
    const access = await prisma.viewerAccess.findMany({
        select: {
            status: true,
            reason: true,
            rejectReason: true,
            date: true,
            viewer: {
                select: {
                    username: true
                }
            }
        }
    })

    return access;
}

export const readViewerAccessByUserId = async ({userId}: {userId: string}) => {
    const access = await prisma.viewerAccess.findFirst({
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

export const createViewerAccess = async ({userId, reason}: {userId: string, reason: string | undefined}) => {
    const access = await prisma.viewerAccess.create({
        data: {
            userId,
            reason
        }
    })

    return access;
}

export const updateViewerAccess = async ({userId, status, reason, rejectReason}: {userId: string, status: accessStatus, reason?: string | undefined, rejectReason?: string | undefined}) => {
    const access = await prisma.viewerAccess.update({
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