import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    "use server";
    const session = await auth.api.getSession({ headers: req.headers });

    return NextResponse.json({
        user: session?.user ?? null,
    })
}