"use server";
import {SignInSchema} from "@/lib/validations";
import {NextResponse} from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {auth} from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, rememberMe } = SignInSchema.parse(body)

        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
                rememberMe: rememberMe ?? false,
            },
        });

        if (!response.user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const user = response.user;
        return NextResponse.json({ success: true, data: { user: user } }, { status: 200 })
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: z.treeifyError(error) }, { status: 400 })
        }

        console.error(error)

        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 })
    }
}