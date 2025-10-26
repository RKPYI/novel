import React from "react";
import Header from "@/components/Header";
import {UserProvider} from "@/context/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <Header />
            <main>{children}</main>
        </UserProvider>
    )
}