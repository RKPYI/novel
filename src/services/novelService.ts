import {prisma} from "@/lib/prisma";
import {ForbiddenError, NotFoundError} from "@/types/error";
import {NovelSchemaType} from "@/types/novel";
import {NovelStatus, Role} from "@prisma/client";
import {generateUniqueSlug} from "@/lib/helpers/slugHelpers";

export async function getNovels() {
    return prisma.novel.findMany();
}

export async function getNovelBySlug(slug: string) {
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
        throw new NotFoundError("Novel not found");
    }

    return novel;
}

export async function createNovel(input: NovelSchemaType, user: { id: string; role?: Role }) {
    if (!user) throw new ForbiddenError("Unauthorized");

    const role = user.role ?? Role.USER;
    if (role !== Role.ADMIN && role !== Role.AUTHOR) throw new ForbiddenError("Forbidden");

    const slug = await generateUniqueSlug(input.title);
    if (!slug) throw new Error("Slug failed to generate");

    return prisma.novel.create({
        data: {
            title: input.title,
            authorId: user.id,
            slug,
            description: input.description,
            status: input.status ?? NovelStatus.ONGOING,
            coverUrl: input.coverUrl,
            authorName: input.authorName
        },
    });
}

export async function addViewToNovel(slug: string) {
    try {
        return await prisma.novel.update({
            where: { slug },
            data: { views: { increment: 1 } },
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
    } catch {
        throw new NotFoundError("Novel not found");
    }
}

export async function searchNovel(q: string | null, limitParam: string | null) {
    const take = Math.min(Math.max(Number(limitParam) || 20, 1), 50);

    if (!q) return [];
    if (q.length < 3) {
        return [];
    }

    return prisma.novel.findMany({
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
}