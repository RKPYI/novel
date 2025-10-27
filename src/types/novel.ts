// Shared Novel-related types
// Prefer deriving from Prisma include/select for safety
import type { Role, Novel } from "@prisma/client";

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
