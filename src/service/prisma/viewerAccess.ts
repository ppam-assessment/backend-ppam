import { accessStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const readAllViewerAccess = async () => {
    const access = await prisma.viewerAccess.findMany({
        select: {
            id: true,
            status: true,
            date: true
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
            date: true
        }
    })

    return access;
}

export const createViewerAccess = async ({userId}: {userId: string}) => {
    const access = await prisma.viewerAccess.create({
        data: {
            userId
        }
    })

    return access;
}

export const updateViewerAccess = async ({accessId, status}: {accessId: number, status: accessStatus}) => {
    const access = await prisma.viewerAccess.update({
        where: {
            id: accessId
        },
        data: {
            status: status
        }
    })

    return access;
}