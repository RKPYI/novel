'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, {useEffect, useRef, useState} from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'
import {User} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {useUser} from "@/context/UserContext";
import {useTheme} from "next-themes";
import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import ModeToggle from "@/components/ModeToggle";
import AuthModal from "@/components/forms/AuthModal";

export default function Header () {
    const { user, mutateUser, isLoading } = useUser();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);


    // Handle click outside to close search results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
                setIsSearchFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Show/hide results based on search state
    useEffect(() => {
        if (searchQuery.length >= 3 && isSearchFocused) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchQuery, isSearchFocused]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
        if (searchQuery.length >= 3) {
            setShowResults(true);
        }
    };

    const handleSearchClear = () => {
        setSearchQuery("");
        setShowResults(false);
    };

    const handleResultClick = () => {
        setShowResults(false);
        setIsSearchFocused(false);
    };

    return (
        <header className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 border-b backdrop-blur z-50`}>
            <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
            {/* Left side - Logo and Navigation */}
                <div className="flex items-center space-x-6">
                    <Link
                        href="/"
                        className="flex items-center transition-opacity hover:opacity-80"
                    >
                        {!mounted ? (
                            <div className="bg-muted h-8 w-[120px] animate-pulse rounded" />
                        ):(
                            <Image
                                src={
                                    resolvedTheme === "dark"
                                        ? "/rantale-dark.svg"
                                        : "/rantale-light.svg"
                                }
                                alt="NovelAPP"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        )}
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden items-center space-x-4 md:flex">
                        {/*<Link*/}
                        {/*    href="/search"*/}
                        {/*    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"*/}
                        {/*>*/}
                        {/*    Browse*/}
                        {/*</Link>*/}
                    </div>
                </div>

                {/* Middle - Search bar */}
                <div className="relative mx-4 max-w-md flex-1 md:mx-8" ref={searchRef}>
                    <div className="relative">
                        <Search className="text-muted-forground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                            placeholder="Search novels, authors..."
                            className="w-full pr-10 pl-10"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0"
                                onClick={handleSearchClear}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}

                </div>

                {/* Right side - Auth section */}
                <div className="flex items-center space-x-4">
                    <ModeToggle/>
                    {/* Loading State */}
                    {isLoading ? (
                        <div className="bg-muted h-8 w-8 animate-pulse rounded-full"></div>
                    ) : user ? (
                        <UserDropdown user={user} mutateUserAction={mutateUser} />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <AuthModal
                                trigger={
                                    <Button variant="ghost" size="sm">Sign in</Button>
                                }
                                defaultTab="signin"
                            />
                            <AuthModal
                                trigger={
                                    <Button size="sm">Sign Up</Button>
                                }
                                defaultTab="signup"
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}