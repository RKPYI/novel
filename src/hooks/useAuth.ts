"use client";

import { api } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import Error from "next/error";
import {ZodError} from "zod";
import {User} from "@prisma/client";

export function useAuth() {
    const { mutateUser } = useUser();

    const signInEmail = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const res = await api.post<{ success?: boolean, data: { user: User }, error?: string }>("/api/auth/signin", {
                email,
                password,
                rememberMe,
            });

            if (res?.data?.user) {
                mutateUser(); // refresh user context
            }

            return res;
        } catch (err: unknown) {
            return err;
        }
    };

    const signUpEmail = async (email: string, password: string, name?: string) => {
        try {
            const res = await api.post<{ success: boolean, data: { user: User }, error?: string }>("/api/auth/signup", {
                email,
                password,
                name,
            });

            if (res?.data?.user) {
                mutateUser(); // refresh user context
            }

            return res;
        } catch (err: unknown) {
            // return { error: err?.details?.error || err.message || "Failed to sign up" };
            return err
        }
    };

    const signOut = async () => {
        try {
            await api.post("/api/auth/signout");
            mutateUser();
        } catch (err) {
            console.error("Sign out failed:", err);
        }
    };

    return { signInEmail, signUpEmail, signOut };
}
