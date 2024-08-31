import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { accessStatus } from '@prisma/client'


export const postViewerAccessSchema = z.object({
    id: z.number({ required_error: "Id is empty"}),
    status: z.nativeEnum(accessStatus),
})

export type PostViewerAccessSchema = z.infer<typeof postViewerAccessSchema>

export const { schemas: viewerAccessSchema, $ref } = buildJsonSchemas({
    postViewerAccessSchema
}, { $id: 'viewerAccessSchema' })