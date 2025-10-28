'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, {useEffect, useRef, useState} from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'
import {NovelStatus, User} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {useUser} from "@/context/UserContext";
import {useTheme} from "next-themes";
import {BookOpen, Clock, Eye, Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import ModeToggle from "@/components/ModeToggle";
import AuthModal from "@/components/forms/AuthModal";
import {Badge} from "@/components/ui/badge";
import {SearchSpinner} from "@/components/ui/spinner";
import {Novel} from ".prisma/client";
import {Card, CardContent} from "@/components/ui/card";
import {formatBigNumber, getStatusColor} from "@/lib/helpers/novelHelpers";

export default function Header () {
    const { user, mutateUser, isLoading } = useUser();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Pick<Novel, 'id' | 'slug' | 'title' | 'authorName' | 'coverUrl' | 'status' | 'totalChapters' | 'views'>[]>([]);
    const abortRef = useRef<AbortController | null>(null);

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

    // Fetch search results with debounce and abort
    useEffect(() => {
        // Reset when not enough chars or not focused
        if (!isSearchFocused || searchQuery.trim().length < 3) {
            setSearchLoading(false);
            setSearchResults([]);
            if (abortRef.current) abortRef.current.abort();
            return;
        }

        setSearchLoading(true);
        const controller = new AbortController();
        // Cancel previous request
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = controller;

        const timeout = setTimeout(async () => {
            try {
                const resp = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`, { signal: controller.signal });
                if (!resp.ok) throw new Error(`Search failed: ${resp.status}`);
                const json = await resp.json();
                setSearchResults(json?.data?.results ?? []);
            } catch (err: unknown) {
                if (err instanceof Error){
                    if (err?.name === 'AbortError') return
                }

                console.error(err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 250);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
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
                    {showResults && (
                        <Card className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto py-0">
                            <CardContent className="p-0">
                                {searchQuery.length < 3 ? (
                                    <div className="text-muted-foreground p-4 text-center text-sm">
                                        Type at least 3 characters to search
                                    </div>
                                ) : searchLoading ? (
                                    <div className="p-6 text-center">
                                        <SearchSpinner />
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    <div className="py-2">
                                        <div className="text-muted-foreground border-b px-3 py-2 text-xs font-medium">
                                            {searchResults.length} result
                                            {searchResults.length !== 1 ? "s" : ""} found
                                        </div>
                                        {searchResults.slice(0, 8).map((novel) => (
                                            <Link
                                                key={novel.id}
                                                href={`/novels/${novel.slug}`}
                                                className="hover:bg-muted/50 block transition-colors"
                                                onClick={handleResultClick}
                                            >
                                                <div className="flex items-center gap-3 p-3">
                                                    {/* Novel Cover */}
                                                    <div className="flex-shrink-0">
                                                        {novel.coverUrl ? (
                                                            <Image
                                                                src={novel.coverUrl}
                                                                alt={novel.title}
                                                                width={48}
                                                                height={64}
                                                                className="bg-muted rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="bg-muted flex h-16 w-12 items-center justify-center rounded">
                                                                <BookOpen className="text-muted-foreground h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Novel Info */}
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="truncate text-sm font-medium">
                                                            {novel.title}
                                                        </h4>
                                                        <p className="text-muted-foreground truncate text-xs">
                                                            by {novel.authorName ?? "Anonymous"}
                                                        </p>

                                                        {/* Novel Stats */}
                                                        <div className="mt-1 flex items-center gap-3">
                                                            {/*<div className="flex items-center gap-1">*/}
                                                            {/*    <Star className="h-3 w-3 fill-current text-yellow-400" />*/}
                                                            {/*    <span className="text-xs">*/}
                                                            {/*      {formatRating(novel.rating)}*/}
                                                            {/*    </span>*/}
                                                            {/*</div>*/}
                                                            <Badge variant={
                                                                novel.status === NovelStatus.COMPLETED
                                                                    ? "default"
                                                                    : novel.status === NovelStatus.ONGOING
                                                                        ? "secondary"
                                                                        : "outline"
                                                            } className="h-4 text-xs">
                                                                {novel.status}
                                                            </Badge>
                                                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <Clock className="h-3 w-3" />
                                                                {novel.totalChapters} ch
                                                            </div>
                                                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <Eye className="h-3 w-3" />
                                                                {formatBigNumber(novel.views)}
                                                            </div>
                                                        </div>

                                                        {/* Genres */}
                                                        {/*{novel.genres.length > 0 && (*/}
                                                        {/*    <div className="mt-1 flex flex-wrap gap-1">*/}
                                                        {/*        {novel.genres.slice(0, 2).map((genre) => (*/}
                                                        {/*            <Badge*/}
                                                        {/*                key={genre.id}*/}
                                                        {/*                variant="secondary"*/}
                                                        {/*                className="h-4 text-xs"*/}
                                                        {/*            >*/}
                                                        {/*                {genre.name}*/}
                                                        {/*            </Badge>*/}
                                                        {/*        ))}*/}
                                                        {/*        {novel.genres.length > 2 && (*/}
                                                        {/*            <span className="text-muted-foreground text-xs">*/}
                                                        {/*                +{novel.genres.length - 2}*/}
                                                        {/*            </span>*/}
                                                        {/*        )}*/}
                                                        {/*    </div>*/}
                                                        {/*)}*/}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}

                                        <div className="border-t p-3 text-center">
                                            <Link
                                                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                                className="text-primary text-sm font-medium hover:underline"
                                                onClick={handleResultClick}
                                            >
                                                {searchResults.length > 8 ? (
                                                    <>View all {searchResults.length} results</>
                                                ) : (
                                                    <>Advanced search & filters</>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <BookOpen className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                        <p className="text-muted-foreground text-sm">
                                            No novels found
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Try different keywords
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

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