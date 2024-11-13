import { accessStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

export const readAllViewerAccess = async () => {
    const access = await prisma.viewerAccess.findMany({
        select: {
            status: true,
            reason: true,
            rejectReason: true,
            date: true,
            province: true,
            city: true,
            provinceId: true,
            cityId: true,
            viewer: {
                select: {
                    username: true
                }
            }
        }
    })

    return access;
}

export const readViewerAccessByUserId = async ({userId, provinceId, cityId}: {userId: string, provinceId?: number | null, cityId?: number | null}) => {
    const access = await prisma.viewerAccess.findMany({
        where: {
            userId,
            provinceId,
            cityId
        },
        select: {
            id: true,
            status: true,
            reason:true,
            date: true,
            rejectReason: true,
            provinceId: true,
            cityId: true,
            province: true,
            city: true
        }
    })

    return access;
}

export const createViewerAccess = async ({userId, reason, provinceId, cityId}: {userId: string, reason?: string, provinceId?: number | null, cityId?: number | null}) => {
    const access = await prisma.viewerAccess.create({
        data: {
            userId,
            reason,
            provinceId,
            cityId
        }
    })

    return access;
}

export const updateViewerAccess = async ({userId, status, reason, rejectReason, provinceId, cityId}: {userId: string, status: accessStatus, reason?: string | undefined, rejectReason?: string | undefined, provinceId?: number | null, cityId?: number | null}) => {
    const access = await prisma.viewerAccess.update({
        where: {
            userId,
            cityId,
            provinceId
        },
        data: {
            status,
            reason,
            rejectReason,
            provinceId,
            cityId
        },
    })

    return access;
}