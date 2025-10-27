// Shared Novel-related types
// Prefer deriving from Prisma include/select for safety
import type {Role, Novel, User} from "@prisma/client";
import {z} from "zod";
import {NovelSchema} from "@/lib/validations";

export type AuthorSummary = {
  id: string;
  name: string;
  image: string | null;
  role: Role;
};

// Simple and safe: DB Novel plus author summary
export type NovelWithAuthor = Novel & { author: AuthorSummary };

// API DTOs
export type NovelsResponse = { novels: Novel[] };
export type NovelResponse = { novel: NovelWithAuthor };

export type NovelSchemaType = z.infer<typeof NovelSchema>;

export type NovelContextType = {
    novels: Novel[] | null
    novelMap: Record<string, NovelWithAuthor> // slug -> novel with author
    isLoading: boolean
    mutateNovels: () => void
    addView: (slug: string) => Promise<NovelWithAuthor | null>
    fetchNovel: (slug: string) => Promise<NovelWithAuthor | null>
    updateNovel: (slug: string, data: Partial<Novel>) => Promise<Novel | null>
}