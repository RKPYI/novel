'use client'

import React, { createContext, useContext } from 'react'
import useSWR from 'swr'

type UserContextType = {
    user: any
    isLoading: boolean
    mutateUser: () => void
}

const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    mutateUser: () => {},
})

const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
        revalidateOnFocus: false,
    })

    const user = data?.user ?? null

    const mutateUser = async () => {
        await mutate() // ensures revalidation completes
    }

    return (
        <UserContext.Provider value={{ user, isLoading, mutateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
