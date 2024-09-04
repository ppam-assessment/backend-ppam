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

export const inputMetadataSchema = z.object({
    areaId: z.number({required_error: 'areaId is required.'}),
    leader: z.string(),
    date: z.date().default(new Date(Date.now())),
    participant: z.string()
})

export type InputResponseSchema = z.infer<typeof inputResponseSchema>
export type InputMetadataSchema = z.infer<typeof inputMetadataSchema>

export const { schemas: responseSchemas, $ref } = buildJsonSchemas({
    inputResponseSchema,
    inputMetadataSchema
}, { $id: 'responseSchema' })