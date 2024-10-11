import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Status } from "@prisma/client";
import { createSubmitterAccess, readAllSubmitterAccess, readSubmitterAccessByUserId, updateSubmitterAccess } from "../../service/prisma/submitterAccess.js";
import { PostSubmitterAccessSchema, PutSubmitterAccessSchema } from "./schema.js";
import { actionAccess } from "../../utils/enum/actionAccess.js";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { Conflict } from "../../exceptions/Conflict.js";
import { UnprocessableEntity } from "../../exceptions/UnprocessableEntity.js";
import { readUserByUsername } from "../../service/prisma/user.js";

export const getSubmitterAccessController = async (req: FastifyRequest, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    console.log('Session not found');
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    let data: any

    switch (user.status) {
        case Status.admin:
            const submitterAccess = await readAllSubmitterAccess();
            data = submitterAccess.map( item => {
                return {
                    date: item.date,
                    username: item.submitter.username,
                    reason: item.reason,
                    rejectReason: item.rejectReason,
                    status: item.status
                }
            })
            break;
        case Status.submitter:
            const viewAccess = await readSubmitterAccessByUserId({userId: user.id})
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

    res.code(200).send({
        message: 'success',
        data
    })
}

export const postSubmitterAccessController = async (req: FastifyRequest<{Body: PostSubmitterAccessSchema}>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const {reason} = req.body

    const access = await readSubmitterAccessByUserId({userId: user.id})

    if (user.status !== Status.submitter) {
        throw new Forbidden("User doesn't have access.");
    } else if (access) {
        throw new Conflict(`View access already created for ${user.username}.`)
    }

    await createSubmitterAccess({ userId: user.id, reason });

    return res.code(201).send({
        message: `Access requested for ${user.username}.`,
    })
}

export const putResubmitAccessController = async (req: FastifyRequest<{ Body: PutSubmitterAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })
    const isSubmitter = user.status === Status.submitter;

    const { status, reason } = req.body

    if( !isSubmitter || status === actionAccess.approve || status === actionAccess.reject ) throw new NotFound("User doesn't have access."); 

    const updatedStatus = accessStatus.pending

    await updateSubmitterAccess({userId: user.id , status: updatedStatus, reason: isSubmitter ? reason : undefined })

    res.code(200).send({
        message: `Access status updated to ${status} for ${user.username}`,
    })
}

export const putSubmitterAccessController = async (req: FastifyRequest<{ Body: PutSubmitterAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id }).catch( () => {
        throw new NotFound("User not found.")
    })

    const { username } = req.params as { username: string }
    const { status, reason, rejectReason } = req.body

    if (user.status !== Status.admin && (status === actionAccess.approve || status === actionAccess.reject)) throw new UnprocessableEntity('Undefined action')

    const updatedStatus = status === actionAccess.approve
        ? accessStatus.approved
        : status === actionAccess.reject
            ? accessStatus.rejected
            : accessStatus.pending

        const viewer = await readUserByUsername({ username})

    const isViewer = user.status === Status.viewer;
    
    await updateSubmitterAccess({userId: viewer.id , status: updatedStatus, reason: isViewer ? reason : undefined, rejectReason })

    res.code(200).send({
        message: `Access status updated to ${status} for ${viewer.username}`
    })

}