import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const inputResponseSchema = z.object({
    userId: z.string().optional(),
    instrumentId: z.number({ required_error: "Instrument not found."}).refine((val) => val < 196 || val > 199, {
        message: "instrumentId for topic-0 not allowed.",
      }),
    value: z.union([z.string(), z.string().array() ]),
    score: z.number().default(0),
    comment: z.string().optional(),

}).array()

export const inputMetadataSchema = z.object({
    leader: z.string(),
    date: z.date().default(new Date(Date.now())),
    participant: z.string(),
    provinceId: z.number().optional(),
    cityId: z.number().optional()
})

export type InputResponseSchema = z.infer<typeof inputResponseSchema>
export type InputMetadataSchema = z.infer<typeof inputMetadataSchema>

export const { schemas: responseSchemas, $ref } = buildJsonSchemas({
    inputResponseSchema,
    inputMetadataSchema
}, { $id: 'responseSchema' })