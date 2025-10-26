import { prisma } from "@/lib/prisma";

/**
 * Returns an async Zod refinement function to check if a field is unique.
 * Example usage:
 *   z.string().email().refine(isUnique("user", "email"), { message: "Email already exists" })
 */
export function isUnique<ModelName extends keyof typeof prisma, FieldName extends string>(
    model: ModelName,
    field: FieldName
) {
    return async (value: string) => {
        // @ts-expect-error: dynamic model access is fine here
        const existing = await prisma[model].findUnique({
            where: { [field]: value },
        });

        return !existing; // true means pass, false means fail
    };
}
