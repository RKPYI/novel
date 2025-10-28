import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || searchParams.get("query") || "").trim();
    const limitParam = searchParams.get("limit");
    const take = Math.min(Math.max(Number(limitParam) || 20, 1), 50);

    if (q.length < 3) {
      return NextResponse.json({ data: { results: [] } }, { status: 200 });
    }

    const results = await prisma.novel.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { authorName: { contains: q, mode: "insensitive" } },
          {
            AND: [
              { authorName: null },
              { author: { name: { contains: q, mode: "insensitive" } } },
            ],
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        authorName: true,
        coverUrl: true,
        status: true,
        totalChapters: true,
        views: true
      },
      take,
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: { results } }, { status: 200 });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
