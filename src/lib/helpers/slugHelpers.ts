import {prisma} from "@/lib/prisma";

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}

/**
 * Generate a unique slug for a given title.
 * If the slug already exists in the given Prisma model,
 * it will append `-1`, `-2`, etc. until unique.
 */
export async function generateUniqueSlug(
    title: string,
    model: keyof typeof prisma = "novel"
): Promise<string> {
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;

    // @ts-expect-error dynamic model access is fine here
    let existing = await prisma[model].findUnique({ where: { slug } });

    while (existing) {
        slug = `${baseSlug}-${count++}`;
        // @ts-expect-error dynamic model access is fine here
        existing = await prisma[model].findUnique({ where: { slug } });
    }

    return slug;
}