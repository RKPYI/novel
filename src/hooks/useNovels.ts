import useSWR from "swr";
import {fetcher} from "@/lib/helpers/fetcher";
import type {  NovelResponse } from "@/types/novel";
import {useNovelContext} from "@/context/NovelContext";
import {useEffect} from "react";

export function useNovel(slug: string) {
    const { data, error, isLoading } = useSWR<NovelResponse>(
        `/api/novels/${slug}`,
        fetcher
    );

    return {
        data: (data?.novel ?? null) as NovelResponse["novel"] | null,
        loading: isLoading,
        error,
    };
}