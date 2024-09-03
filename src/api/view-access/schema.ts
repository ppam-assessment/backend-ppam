import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { viewStatus } from '../../utils/enum/viewAccess.js'

export const postViewerAccessSchema = z.object({
    reason: z.string().optional()
})

export const putViewerAccessSchema = z.object({
    id: z.number({ required_error: "Id is empty"}),
    status: z.nativeEnum(viewStatus),
    reason: z.string().optional()
})

export type PutViewerAccessSchema = z.infer<typeof putViewerAccessSchema>
export type PostViewerAccessSchema = z.infer<typeof postViewerAccessSchema>

export const { schemas: viewerAccessSchema, $ref } = buildJsonSchemas({
    putViewerAccessSchema,
    postViewerAccessSchema
}, { $id: 'viewerAccessSchema' })