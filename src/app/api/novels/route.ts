import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import {NovelSchema} from "@/lib/validations";
import {generateUniqueSlug} from "@/lib/helpers/slugHelpers";
import {z, ZodError} from "zod";
import { auth } from "@/lib/auth";
import { Role, User } from "@prisma/client";
import {getNovels} from "@/services/novelService";

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
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Role-based check
        let role: Role = (user as any)?.role ?? Role.USER;
        if (!role) {
            const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
            role = dbUser?.role ?? Role.USER;
        }
        if (role !== Role.ADMIN && role !== Role.AUTHOR) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 3. Parse and validate input
        const body = await req.json();
        const { authorName, status, coverUrl, title, description } = NovelSchema.parse(body);

        // 4. Use the authenticated user as author
        const authorId = user.id as string;

        // 5. Generate slug
        const slug = await generateUniqueSlug(title, "novel");
        if (!slug) return NextResponse.json({ data: { error: "Slug failed to generated" }, status: 500 });

        // 6. Create novel
        const novel = await prisma.novel.create({
            data: {title, authorId, slug, description, status, coverUrl, authorName},
        })

        return NextResponse.json({data: {novel: novel}}, {status: 201});
    } catch (err: unknown) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: z.treeifyError(err) }, { status: 400 });
        }

        console.error(err);

        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}