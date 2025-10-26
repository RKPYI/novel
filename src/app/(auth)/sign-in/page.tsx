'use client'

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { createAuthClient } from "better-auth/client";
import InputField from "@/components/forms/InputField";
import {Button} from "@/components/ui/button";

const authClient = createAuthClient();

export default function SignInPage() {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    })

    const onSubmit: SubmitHandler<SignInFormData> = async ({ email, password }) => {
        try {
            const res = await authClient.signIn.email({ email, password, rememberMe: true });
            if (res?.error) {
                console.error(res.error);
                return;
            }
            // success: redirect
            router.push('/');
        } catch (e: unknown) {
            console.error(e);
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome Back</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="novel@gmail.com"
                    register={register}
                    error={errors.email?.message}
                    type="email"
                />
                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password?.message}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign in'}
                </Button>
            </form>
        </>
    )
}