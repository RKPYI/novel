'use client'

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { createAuthClient } from "better-auth/client";
import InputField from "@/components/forms/InputField";
import {Button} from "@/components/ui/button";

const authClient = createAuthClient();

export default function SignUpPage() {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
        mode: 'onBlur'
    })

    const onSubmit: SubmitHandler<SignUpFormData> = async ({ email, password, name }) => {
        try {
            const res = await authClient.signUp.email({ email, password, name });
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
            <h1 className="form-title">Sign Up & Personalize</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="name"
                    label="Name"
                    placeholder="Novel Lovers"
                    register={register}
                    error={errors.name?.message}
                />
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