'use client'

import React, { createContext, useContext, useState } from "react"
import useSWR from "swr"
import { api } from "@/lib/api"
import {Novel} from ".prisma/client";
import {NovelContextType, NovelWithAuthor} from "@/types/novel";

// --- Default context ---
const NovelContext = createContext<NovelContextType>({
    novels: null,
    novelMap: {},
    isLoading: true,
    mutateNovels: () => {},
    addView: async () => null,
    fetchNovel: async () => null,
    updateNovel: async () => null,
})

// --- Provider ---
export const NovelProvider = ({ children }: { children: React.ReactNode }) => {
    // SWR for the novel list
    const { data, error, isLoading, mutate } = useSWR<{ data: { novels: Novel[] } }>(
        "/api/novels",
        api.get,
        { revalidateOnFocus: false }
    )

    // Map for caching individual novels by slug
    const [novelMap, setNovelMap] = useState<Record<string, NovelWithAuthor>>({})

    // Increment view
    const addView = async (slug: string) => {
        try {
            const res = await api.patch<{ data: { novel: NovelWithAuthor } }>(`/api/novels/${slug}/view`)
            // Update map & refresh list
            setNovelMap(prev => ({ ...prev, [slug]: res.data.novel }))
            await mutate()
            return res.data.novel
        } catch (err) {
            console.error(err)
            return null
        }
    }

    // Fetch single novel (check cache first)
    const fetchNovel = async (slug: string) => {
        if (novelMap[slug]) return novelMap[slug]

        try {
            const res = await api.get<{ data: { novel: NovelWithAuthor } }>(`/api/novels/${slug}`)
            setNovelMap(prev => ({ ...prev, [slug]: res.data.novel }))
            return res.data.novel
        } catch (err) {
            console.error(err)
            return null
        }
    }

    // Update novel (API not Implemented Yet)
    const updateNovel = async (slug: string, updateData: Partial<Novel>) => {
        try {
            // Perform update, then fetch full novel with author to keep cache consistent
            await api.put<{ data: { novel: Novel } }>(`/api/novels/${slug}`, updateData)
            const refreshed = await api.get<{ data: { novel: NovelWithAuthor } }>(`/api/novels/${slug}`)
            setNovelMap(prev => ({ ...prev, [slug]: refreshed.data.novel }))
            await mutate()
            return refreshed.data.novel as unknown as Novel // maintain existing return type
        } catch (err) {
            console.error(err)
            return null
        }
    }

    return (
        <NovelContext.Provider
            value={{
                novels: data?.data?.novels ?? null,
                novelMap,
                isLoading,
                mutateNovels: mutate,
                addView,
                fetchNovel,
                updateNovel,
            }}
        >
            {children}
        </NovelContext.Provider>
    )
}

// --- Hook ---
export const useNovelContext = () => useContext(NovelContext)
