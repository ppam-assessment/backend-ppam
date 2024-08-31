import { accessStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

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