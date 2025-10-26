"use client";

import { NovelDetailView } from "@/components/novels/NovelDetailView";
import { useNovel } from "@/hooks/useNovels";
import { useParams } from "next/navigation";

export default function NovelPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data, loading, error } = useNovel(slug);

    if (loading) return <p>Loading...</p>;
    if (error || !data?.id) return <p>Novel not found.</p>;

    return <NovelDetailView novel={data} />;
}
