import { z } from 'zod'
import { isUnique } from "@/lib/helpers/zodHelpers";
import {NovelStatus, Role} from "@prisma/client";

export const SignUpSchema = z.object({
    email: z
        .email({ error: "Please provide a valid email address." })
        .min(1, { error: "Email is required." })
        .refine(isUnique("user", "email"), { error: 'Email already exists' }),
    password: z
        .string({ error: "Password is required" })
        .min(6, { error: "Password must be at least 6 characters long." })
        .max(100, { error: 'Password cannot exceed 100 characters.' }),
    name: z.string({ error: "Name is required" }).min(3, { error: "Name must be at least 3 characters long." }),
})

export const SignInSchema = z.object({
    email: z.email({ error: "Please provide a valid email address." }).min(1, { error: 'Email is required.' }),
    password: z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters long." }),
    rememberMe: z.boolean().optional(),
})

export const SignOutSchema = z.object({})

export const UserSchema = z.object({
    email: z.email().refine(isUnique("user", "email"), { error: 'email already exists' }),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(Role).optional(),
})

export const NovelSchema = z.object({
    authorId: z.string().optional(),
    authorName: z.string().optional(),
    title: z.string(),
    slug: z.string().refine(isUnique("novel", "slug"), { error: 'slug already exists' }).optional(),
    description: z.string().optional(),
    status: z.enum(NovelStatus).optional(),
    coverUrl: z.url().optional(),
    totalChapters: z.number().int().optional(),
})

export const ChapterSchema = z.object({
    novelId: z.string(),
    chapterNumber: z.number().int().positive().optional(),
    title: z.string(),
    content: z.string(),
    wordCount: z.number().int().positive().optional(),
    isFree: z.boolean().optional(),
})