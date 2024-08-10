import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


export const inputResponse = z.object({
    userId: z.string().optional(),
    instrumentId: z.number({ required_error: "Instrument not found."}),
    value: z.string({ required_error: "Value is empty."}),
    score: z.number().default(0),
    comment: z.string().optional(),

}).required().array()

export type InputResponseSchema = z.infer<typeof inputResponse>

export const { schemas: responseSchemas, $ref } = buildJsonSchemas({
    inputResponse
})