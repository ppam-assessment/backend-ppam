import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { actionAccess } from '../../utils/enum/actionAccess.js'

export const postViewerAccessSchema = z.object({
    reason: z.string().optional()
})

export const putViewerAccessSchema = z.object({
    status: z.nativeEnum(actionAccess),
    reason: z.string().optional(),
    rejectReason: z.string().optional()
})

export type PutViewerAccessSchema = z.infer<typeof putViewerAccessSchema>
export type PostViewerAccessSchema = z.infer<typeof postViewerAccessSchema>

export const { schemas: viewerAccessSchema, $ref } = buildJsonSchemas({
    putViewerAccessSchema,
    postViewerAccessSchema
}, { $id: 'viewerAccessSchema' })