import {prisma} from "@/lib/prisma";
import {NotFoundError} from "@/types/error";

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