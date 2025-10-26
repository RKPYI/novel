'use client'

import {useNovels} from "@/hooks/useNovels";
import {Loader} from "lucide-react";
import {NovelCard} from "@/components/novels/NovelCard";

export function NovelsList() {
    const { data, loading, error } = useNovels()

    if (loading) return <Loader />
    if (error) return <div>Failed to load</div>

    return (
        <>
            {data.map(item => {
                return <NovelCard
                    size="featured"
                    key={item.id}
                    novel={item}
                />
            })}
        </>
    )
}