import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const putViewerAccessSchema = z.object({
    id: z.number({ required_error: "Id is empty"}),
    status: z.nativeEnum(viewStatus),
})

export type PutViewerAccessSchema = z.infer<typeof putViewerAccessSchema>

export const { schemas: viewerAccessSchema, $ref } = buildJsonSchemas({
    putViewerAccessSchema
}, { $id: 'viewerAccessSchema' })