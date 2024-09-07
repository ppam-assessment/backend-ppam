import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Status } from "@prisma/client";
import { createViewerAccess, readAllViewerAccess, readViewerAccessByUserId, updateViewerAccess } from "../../service/prisma/viewerAccess.js";
import { PostViewerAccessSchema, PutViewerAccessSchema } from "./schema.js";
import { viewStatus } from "../../utils/enum/viewAccess.js";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { Conflict } from "../../exceptions/Conflict.js";
import { UnprocessableEntity } from "../../exceptions/UnprocessableEntity.js";
import { readUserByUsername } from "../../service/prisma/user.js";

export const getViewerAccessController = async (req: FastifyRequest, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    console.log('Session not found');
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    let data: any

    switch (user.status) {
        case Status.admin:
            const viewerAccess = await readAllViewerAccess();
            data = viewerAccess.map( item => {
                return {
                    date: item.date,
                    username: item.viewer.username,
                    reason: item.reason,
                    rejectReason: item.rejectReason,
                    status: item.status
                }
            })
            break;
        case Status.viewer:
            const viewAccess = await readViewerAccessByUserId({userId: user.id})
            data = {
                status: viewAccess?.status,
                reason: viewAccess?.reason || '-',
                rejectsReaseon: viewAccess?.rejectReason || '-',
                date: viewAccess?.date
            }        
            break;
        default:
            throw new Forbidden("User doesn't have access.");
    }

    res.send({
        message: 'success',
        data
    })
}

export const postViewerAccessController = async (req: FastifyRequest<{Body: PostViewerAccessSchema}>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const {reason} = req.body

    const access = await readViewerAccessByUserId({userId: user.id})

    if (user.status !== Status.viewer) {
        throw new Forbidden("User doesn't have access.");
    } else if (access) {
        throw new Conflict(`View access already created for ${user.username}.`)
    }

    await createViewerAccess({ userId: user.id, reason });

    return res.code(201).send({
        message: `Access requested for ${user.username}.`,
    })
}

export const putResubmitAccessController = async (req: FastifyRequest<{ Body: PutViewerAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })
    const isViewer = user.status === Status.viewer;

    const { status, reason } = req.body

    if( !isViewer || status === viewStatus.approve || status === viewStatus.reject ) throw new NotFound("User doesn't have access."); 

    const updatedStatus = accessStatus.pending

    await updateViewerAccess({userId: user.id , status: updatedStatus, reason: isViewer ? reason : undefined })

    res.send({
        message: `Access status updated to ${status} for ${user.username}`,
    })
}

export const putViewerAccessController = async (req: FastifyRequest<{ Body: PutViewerAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const { username } = req.params as { username: string }
    const { status, reason, rejectReason } = req.body

    if (user.status !== Status.admin && (status === viewStatus.approve || status === viewStatus.reject)) throw new UnprocessableEntity('Undefined action')

    const updatedStatus = status === viewStatus.approve
        ? accessStatus.approved
        : status === viewStatus.reject
            ? accessStatus.rejected
            : accessStatus.pending

        const viewer = await readUserByUsername({ username})

    const isViewer = user.status === Status.viewer;
    
    await updateViewerAccess({userId: viewer.id , status: updatedStatus, reason: isViewer ? reason : undefined, rejectReason })

    res.send({
        message: `Access status updated to ${status} for ${viewer.username}`
    })

}