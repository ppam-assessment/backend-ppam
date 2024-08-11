var _a;
import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
export var inputResponseSchema = z.object({
    userId: z.string().optional(),
    instrumentId: z.number({ required_error: "Instrument not found." }),
    value: z.string({ required_error: "Value is empty." }),
    score: z.number().default(0),
    comment: z.string().optional(),
}).array();
export var responseSchemas = (_a = buildJsonSchemas({
    inputResponseSchema: inputResponseSchema
}, { $id: 'responseSchema' }), _a.schemas), $ref = _a.$ref;
