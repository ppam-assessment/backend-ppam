import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { accessStatus, Status } from "@prisma/client";
import { createViewerAccess, readViewerAccessByUserId, updateViewerAccess } from "../../service/prisma/viewerAccess.js";
import { PutViewerAccessSchema } from "./schema.js";

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
        case accessStatus.approved:
        case accessStatus.rejected:
            if (user.status !== Status.admin) {
                return Error("User doesn't have access.");
            }
            break;
        case accessStatus.pending:
            if (user.status !== Status.viewer) {
                return Error("User doesn't have access.");
            }
            break;
        default:
            Error('Undefined action')
            break;
    }

    const updatedAccess = await updateViewerAccess({accessId: id, status})

    res.send({
        message: `Access status updated to ${status} for ${user.username}`,
        data: updatedAccess
    })

}