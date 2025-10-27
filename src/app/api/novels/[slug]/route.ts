import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import {getNovelBySlug} from "@/services/novelService";
import {NotFoundError} from "@/types/error";

export async function GET(
    request: Request,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;
    try {
        const novel = await getNovelBySlug(slug);

        return NextResponse.json({ data: { novel } }, { status: 200 });
    } catch (error) {
        console.error(error);

        if (error instanceof NotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}