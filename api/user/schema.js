var _a;
import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { Status } from '@prisma/client';
export var createUserSchema = z.object({
    email: z.string({ required_error: "Email is empty." }),
    username: z.string({ required_error: "Username is empty." }),
    institute: z.string().optional(),
    password: z.string({ required_error: "Password is empty." }).min(6, "Password minimal 6 karakter."),
    status: z.nativeEnum(Status)
}).required();
export var loginUserSchema = z.object({
    email: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    password: z.string().min(6, "Password minimal 6 karakter.")
}).refine(function (field) { return field.email || field.username; }, {
    message: "Either username or email must be filled.",
    path: ["email", "username"]
});
export var userSchemas = (_a = buildJsonSchemas({
    createUserSchema: createUserSchema,
    loginUserSchema: loginUserSchema
}, { $id: 'userSchema' }), _a.schemas), $ref = _a.$ref;
