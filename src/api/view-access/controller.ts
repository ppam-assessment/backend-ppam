import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Status } from "@prisma/client";
import { createViewerAccess, readAllViewerAccess, readViewerAccessByUserId, updateViewerAccess } from "../../service/prisma/viewerAccess.js";
import { PutViewerAccessSchema } from "./schema.js";

export const getViewerAccessController = async (req: FastifyRequest, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id })

    if (!user) {
        return Error("User not found.");
    } else if (user.status !== Status.admin) {
        return Error("User doesn't have access.");
    }

    const access = await readAllViewerAccess()

    res.send({
        message: 'success',
        data: access
    })
}

export const postViewerAccessController = async (req: FastifyRequest, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id })

    const access = await readViewerAccessByUserId({userId: user.id})

    if (!user) {
        return Error("User not found.");
    } else if (user.status !== Status.viewer) {
        return Error("User doesn't have access.");
    } else if (access) {
        return Error(`View access already created for ${user.username}.`)
    }

    const createdAccess = await createViewerAccess({ userId: user.id });
    return res.code(201).send({
        message: `Access requested for ${user.username}.`,
        data: createdAccess
    })
}

export const putViewerAccessController = async (req: FastifyRequest<{ Body: PutViewerAccessSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id })

    if (!user) {
        return Error("User not found.");
    }

    const { id, status } = req.body

    switch (status) {
        case viewStatus.approve:
        case viewStatus.reject:
            if (user.status !== Status.admin) {
                return Error("User doesn't have access.");
            }
            break;
        case viewStatus.resubmit:
            if (user.status !== Status.viewer) {
                return Error("User doesn't have access.");
            }
            break;
        default:
            Error('Undefined action')
            break;
    }

    const updatedStatus = status === viewStatus.approve
        ? accessStatus.approved
        : status === viewStatus.reject
            ? accessStatus.rejected
            : accessStatus.pending

    const updatedAccess = await updateViewerAccess({accessId: id, status: updatedStatus})

    res.send({
        message: `Access status updated to ${status} for ${user.username}`,
        data: updatedAccess
    })

}