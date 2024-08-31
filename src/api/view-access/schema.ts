import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { accessStatus } from '@prisma/client'


export const putViewerAccessSchema = z.object({
    id: z.number({ required_error: "Id is empty"}),
    status: z.nativeEnum(accessStatus),
})

export type PutViewerAccessSchema = z.infer<typeof putViewerAccessSchema>

export const { schemas: viewerAccessSchema, $ref } = buildJsonSchemas({
    putViewerAccessSchema
}, { $id: 'viewerAccessSchema' })