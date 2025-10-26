import {Novel} from ".prisma/client";
import useSWR from "swr";
import {fetcher} from "@/lib/helpers/fetcher";

type NovelsResponse = { novels: Novel[] };
type NovelResponse = { novel: Novel };

export function useNovels() {
    const { data, error, isLoading } = useSWR<NovelsResponse>(
        "/api/novels",
        fetcher
    );

    return {
        data: data?.novels ?? [],
        loading: isLoading,
        error,
    };
}

export function useNovel(slug: string) {
    const { data, error, isLoading } = useSWR<NovelResponse>(
        `/api/novels/${slug}`,
        fetcher
    );

    return {
        data: data?.novel ?? {},
        loading: isLoading,
        error,
    };
}