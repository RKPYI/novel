import { NextResponse } from "next/server";
import { searchNovel } from "@/services/novelService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQ = searchParams.get("q") ?? searchParams.get("query");
    const q = rawQ ? rawQ.trim() : null;
    const limitParam = searchParams.get("limit");

    const results = await searchNovel(q, limitParam);

    return NextResponse.json({ data: { results } }, { status: 200 });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
