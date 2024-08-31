import { FastifyReply, FastifyRequest } from "fastify";
import { getSessionUser } from "../../service/prisma/session.js";
import { Status } from "@prisma/client";
import { createViewerAccess } from "../../service/prisma/viewerAccess.js";
import { PostViewerAccessSchema } from "./schema.js";

export const postViewerAccessController = async (req: FastifyRequest, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload
    const { user } = await getSessionUser({ id: session.id })

    if (!user) {
        return Error("User not found.");
    } else if (user.status !== Status.viewer) {
        return Error("User doesn't have access.");
    }

    const createdAccess = await createViewerAccess({ userId: user.id });
    return res.code(201).send({
        message: `Access requested for ${user.username}.`,
        data: createdAccess
    })
}