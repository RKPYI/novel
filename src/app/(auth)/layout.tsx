import React from "react";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session?.user) redirect('/')

    return (
        <main className='auth-layout'>
            <section className='auth-left-section scrollbar-hide-default'>
                <Link href="/" className="auth-logo">
                    <Image src="/assets/icons/logo.svg" alt='Signalist logo' width={140} height={32} className='h-8 w-auto' />
                </Link>

                <div className='pb-6 lg:pb-8 flex-1'>{children}</div>
            </section>

            <section className='auth-right-section'>
                <div className='z-10 relative lg:mt-4 lg:mb-16'>
                    <blockquote className='auth-blockquote'>
                        I have a very comfortable reading experience when reading on this website.
                    </blockquote>
                    <div className='flex items-center justify-between'>
                        <div>
                            <cite className='auth-testimonial-author'>- Rangga D.</cite>
                            <p className='max-md: text-xs text-gray-500'>Webnovel Enthusiast</p>
                        </div>
                        <div className='flex items-center gap-0.5'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image src="/assets/icons/star.svg" alt='star' key={star} width={20} height={20} className='w-5 h-5' />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex-1 relative'>
                    <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className='auth-dashboard-preview absolute top-0' />
                </div>
            </section>
        </main>
    )
}