import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { actionAccess } from '../../utils/enum/actionAccess.js'

export const postSubmitterAccessSchema = z.object({
    reason: z.string().optional()
})

export const putSubmitterAccessSchema = z.object({
    status: z.nativeEnum(actionAccess),
    reason: z.string().optional(),
    rejectReason: z.string().optional()
})

export type PutSubmitterAccessSchema = z.infer<typeof putSubmitterAccessSchema>
export type PostSubmitterAccessSchema = z.infer<typeof postSubmitterAccessSchema>

export const { schemas: submitterAccessSchema, $ref } = buildJsonSchemas({
    putSubmitterAccessSchema,
    postSubmitterAccessSchema
}, { $id: 'submitterAccessSchema' })