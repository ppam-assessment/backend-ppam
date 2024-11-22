import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Prisma, Status } from "@prisma/client";
import { createViewerAccess, readAllViewerAccess, readViewerAccess, readViewerAccessByUserId, updateViewerAccess } from "../../service/prisma/viewerAccess.js";
import { PostViewerAccessSchema, PutViewerAccessSchema } from "./schema.js";
import { actionAccess } from "../../utils/enum/actionAccess.js";
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
            data = viewerAccess.map( record => {
                const { city, province} = record
                const area = city ? `Kota/Kab (${city.name})` : province ? `Provinsi (${province.name})` : 'Nasional'
                return {
                    date: record.date,
                    username: record.viewer.username,
                    reason: record.reason,
                    rejectReason: record.rejectReason,
                    status: record.status,
                    area,
                    cityId: record?.cityId,
                    provinceId: record?.provinceId
                }
            })
            break;
        case Status.viewer:
            const viewAccess = await readViewerAccessByUserId({ userId: user.id })
            data = viewAccess.map((record) => {
                const { city, province} = record
                const area = city ? `Kota/Kab (${city.name})` : province ? `Provinsi (${province.name})` : 'Nasional'
                return {
                    status: record?.status,
                    reason: record?.reason || '-',
                    rejectsReaseon: record?.rejectReason || '-',
                    date: record?.date,
                    area,
                    cityId: record?.cityId,
                    provinceId: record?.provinceId
                }
            })
            break;
        default:
            throw new Forbidden("User doesn't have access.");
    }

    res.code(200).send({
        message: 'success',
        data
    })
}

export const postViewerAccessController = async (req: FastifyRequest<{Body: PostViewerAccessSchema}>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const {reason, provinceId, cityId} = req.body

    await readViewerAccess({userId: user.id, provinceId, cityId}).catch( e => {
        if(e.code !== "P2025") throw e
    })

    if (user.status !== Status.viewer) {
        throw new Forbidden("User doesn't have access.");
    }

    await createViewerAccess({ userId: user.id, reason, provinceId, cityId });

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

    const { status, reason, provinceId, cityId } = req.body

    if( !isViewer || status === actionAccess.approve || status === actionAccess.reject ) throw new NotFound("User doesn't have access."); 

    const updatedStatus = accessStatus.pending

    const viewAccess = await readViewerAccess({userId: user.id, provinceId, cityId})
    await updateViewerAccess({id: viewAccess.id, status: updatedStatus, reason: isViewer ? reason : undefined })

    res.code(200).send({
        message: `Access status updated to ${status} for ${user.username}`,
    })
}

export const putViewerAccessController = async (req: FastifyRequest<{ Body: PutViewerAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const { username } = req.params as { username: string }
    const { status, reason, rejectReason, cityId, provinceId } = req.body

    if (user.status !== Status.admin && (status === actionAccess.approve || status === actionAccess.reject)) throw new UnprocessableEntity('Undefined action')

    const updatedStatus = status === actionAccess.approve
        ? accessStatus.approved
        : status === actionAccess.reject
            ? accessStatus.rejected
            : accessStatus.pending

        const viewer = await readUserByUsername({ username})

    const isViewer = user.status === Status.viewer;
    const viewAccess = await readViewerAccess({userId: viewer.id, provinceId, cityId})

    await updateViewerAccess({id: viewAccess.id , status: updatedStatus, reason: isViewer ? reason : undefined, rejectReason, cityId, provinceId })

    res.code(200).send({
        message: `Access status updated to ${status} for ${viewer.username}`
    })

}