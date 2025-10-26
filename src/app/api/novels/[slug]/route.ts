import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(
    request: Request,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;
    try {
        const novel = await prisma.novel.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });
        if (!novel) {
            return NextResponse.json({ error: "Novel not found." }, { status: 404 });
        }
        return NextResponse.json({ data: { novel } }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}