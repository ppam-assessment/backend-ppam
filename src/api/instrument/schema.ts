import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const putInstrumentsSchema = z.object({
    id: z.number(),
    question: z.string({ required_error: "question not found."}),
}).array()

export type PutInstrumentsSchema = z.infer<typeof putInstrumentsSchema>

export const { schemas: instrumentSchema, $ref } = buildJsonSchemas({
    putInstrumentsSchema,
}, { $id: 'instrumentSchema' })