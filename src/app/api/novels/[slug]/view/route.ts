import {addViewToNovel} from "@/services/novelService";
import {NextResponse} from "next/server";
import {NovelWithAuthor} from "@/types/novel";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;
    const updatedNovel = await addViewToNovel(slug);
    return NextResponse.json({ data: {novel: updatedNovel as unknown as NovelWithAuthor} });
}