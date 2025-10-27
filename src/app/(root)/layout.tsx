import React from "react";
import Header from "@/components/Header";
import {UserProvider} from "@/context/UserContext";
import {NovelProvider} from "@/context/NovelContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <NovelProvider>
                <Header />
                <main>{children}</main>
            </NovelProvider>
        </UserProvider>
    )
}