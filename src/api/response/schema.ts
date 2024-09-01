import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


export const inputResponseSchema = z.object({
    userId: z.string().optional(),
    instrumentId: z.number({ required_error: "Instrument not found."}),
    value: z.string({ required_error: "Value is empty."}),
    multivalue: z.string().array().optional(),
    score: z.number().default(0),
    comment: z.string().optional(),

}).array()

export type InputResponseSchema = z.infer<typeof inputResponseSchema>

export const { schemas: responseSchemas, $ref } = buildJsonSchemas({
    inputResponseSchema
}, { $id: 'responseSchema' })