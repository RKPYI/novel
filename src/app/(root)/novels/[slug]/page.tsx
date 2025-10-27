"use client";

import { NovelDetailView } from "@/components/novels/NovelDetailView";
import { useParams } from "next/navigation";
import {Loader2} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNovelContext} from "@/context/NovelContext";
import {NovelWithAuthor} from "@/types/novel";

export default function NovelPage() {
    const { slug } = useParams<{ slug: string }>();
    const { novelMap, fetchNovel, addView, isLoading } = useNovelContext()
    const [novel, setNovel] = useState<NovelWithAuthor | null>(null)

    // Guard to prevent double execution in React Strict Mode (dev)
    const lastExecutedSlugRef = useRef<string | null>(null)

    useEffect(() => {
        // If we've already executed for this slug, skip (prevents double fetch in dev)
        if (lastExecutedSlugRef.current === slug) return
        lastExecutedSlugRef.current = slug

        const loadNovel = async () => {
            // Check cache first
            const cached = novelMap[slug]
            if (cached) {
                setNovel(cached)
            } else {
                const fetched = await fetchNovel(slug)
                setNovel(fetched)
            }

            // Increment view only after novel is loaded
            const updated = await addView(slug)
            if (updated) setNovel(updated)
        }

        loadNovel()
    }, [slug])

    if (isLoading) return <div className="flex justify-center items-center min-w-screen min-h-screen"><Loader2 className=" w-10 h-10 animate-spin" /></div>;
    if (!novel) return <div>Novel Not Found</div>

    return <NovelDetailView novel={novel} />;
}
