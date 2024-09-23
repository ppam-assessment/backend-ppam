import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js"
import { updateViewerAccess } from "./viewerAccess.js";

export const readAllResponseMetadata = async () => {
    const listResponse = await prisma.responseMetadata.findMany({
        select: {
            id: true,
            leader: true,
            participants: true,
            date: true,
            city: true,
            // province: {
            //     select: {
            //         id: true,
            //         name: true
            //     }
            // },
            province: true,
            responder: {
                select: {
                    username: true
                }
            }
        }
    });

    return listResponse;
}

export const readUserIdByMetadataId = async({metaId}: {metaId: number}) => {
    const userId = await prisma.responseMetadata.findFirstOrThrow({
        where: {
            id: metaId,
        },
        select: {
            userId: true
        }
    })

    return userId;
}

export const createResponseMetadata = async({userId, province, leader, date, participant, city}: {userId: string, province: string | undefined, leader: string, date: Date, participant: string, city: string | undefined}) => {
    const metadata = await prisma.responseMetadata.create({
        data: {
            userId,
            // provinceId,
            province,
            leader,
            date,
            participants: participant,
            city
        }
    })

    return metadata;
}

export const readResponseMetadataByUserId = async({userId}: {userId: string}) => {
    const metadata = await prisma.responseMetadata.findFirst({
        select: {
            leader: true,
            date: true,
            participants: true,
            city: true,
            // province: {
            //     select: {
            //         name: true,
            //         id: true
            //     }
            // },
            province: true,
            
        },
        where: {
            userId
        }
    })

    return metadata
}

export const readResponseMetadataByUsername = async({username}: {username: string}) => {
    const metadata = await prisma.responseMetadata.findFirst({
        select: {
            leader: true,
            date: true,
            participants: true,
            city: true,
            // province: {
            //     select: {
            //         name: true,
            //         id: true
            //     }
            // }       
            province: true, 
            },
        where: {
            responder: {
                username: username
            }
        }
    })

    return metadata
}

export const updateResponseMetadata = async({userId, province, leader, date, participant, city}: {userId: string, province: string | undefined, leader: string, date: Date, participant: string, city: string | undefined}) => {
    const metadata = await prisma.responseMetadata.update({
        where: {
            userId,
        },
        data: {
            // provinceId,
            province,
            leader,
            date,
            participants: participant,
            city
        }
    })

    return metadata;
}