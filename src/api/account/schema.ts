import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { Status } from '@prisma/client'

export const createUserSchema = z.object({
    email: z.string({ required_error: "Email is empty." }).toLowerCase(),
    username: z.string({ required_error: "Username is empty." }),
    institute: z.string().optional(),
    password: z.string({ required_error: "Password is empty." }).min(6, "Password minimal 6 karakter."),
    status: z.nativeEnum(Status)
}).required()

export const loginUserSchema = z.object({
    email: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    password: z.string().min(6, "Password minimal 6 karakter.")
}).refine(field => field.email || field.username, {
    message: "Either username or email must be filled.",
    path: ["email", "username"]
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type LoginUserSchema = z.infer<typeof loginUserSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    loginUserSchema
}, { $id: 'userSchema' })