import {NextResponse} from "next/server";
import {NovelSchema} from "@/lib/validations";
import {z, ZodError} from "zod";
import { auth } from "@/lib/auth";
import {createNovel, getNovels} from "@/services/novelService";
import {NovelSchemaType} from "@/types/novel";
import {ForbiddenError, NotAuthorizedError} from "@/types/error";

export async function GET() {
    const novels = await getNovels();
    return NextResponse.json({ data: { novels: novels } }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        // 1. Get session via Better Auth
        const { response } = await auth.api.getSession({ headers: req.headers, returnHeaders: true }).catch(() => ({ response: null } as any));
        const data = response ? await response.json().catch(() => null) : null;
        const user = data?.user ?? data?.session?.user;

        // 3. Parse and validate input
        const body = await req.json();
        const input: NovelSchemaType = NovelSchema.parse(body);

        // 3. Call service
        const novel = await createNovel(input, user);

        return NextResponse.json({data: {novel: novel}}, {status: 201});
    } catch (err: unknown) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: z.treeifyError(err) }, { status: 400 });
        }

        if (err instanceof NotAuthorizedError) return NextResponse.json({ error: err.message }, { status: 401 });
        if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });

        console.error(err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}