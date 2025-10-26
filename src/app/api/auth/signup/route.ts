import {SignUpSchema} from "@/lib/validations";
import {NextResponse} from "next/server";
import {z,ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";
import {auth} from "@/lib/auth";
import {Role} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = await SignUpSchema.parseAsync(body);

        const response = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                role: Role.USER
            }
        });

        if (!response.user) return NextResponse.json({ error: "Failed to create user."}, {status: 400});

        return NextResponse.json({ success: true, data: { user: response.user } }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: z.treeifyError(error) }, { status: 400 });
        }

        console.error(error);

        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}