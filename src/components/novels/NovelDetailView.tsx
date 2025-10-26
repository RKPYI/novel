import Image from "next/image";
import {BookOpen, Calendar, Clock, Eye, Star, TrendingUp, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {formatNumber, getStatusColor} from "@/lib/helpers/novelHelpers";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {cn, formatDate} from "@/lib/utils";
import {Novel} from ".prisma/client";
import {Role} from "@prisma/client";

export function NovelDetailView(
    { novel }: {
        novel: Novel & {
            author: {
                id: string,
                name: string,
                image: string | null,
                role: Role
            }
        }
    }) {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-6">
            {/* Header Section */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Cover Image */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                            {novel.coverUrl ? (
                                <Image
                                    src={novel.coverUrl}
                                    alt={novel.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-gradient-to-br">
                                    <BookOpen className="text-muted-foreground h-20 w-20" />
                                </div>
                            )}

                            {/* Status Badge */}
                            <Badge
                                className={cn(
                                    "absolute top-4 left-4",
                                    getStatusColor(novel.status),
                                )}
                            >
                                {novel.status.charAt(0).toUpperCase() + novel.status.slice(1)}
                            </Badge>

                            {/* Featured/Trending Badges */}
                            {/*{novel.is_featured && (*/}
                            {/*    <Badge variant="destructive" className="absolute top-4 right-4">*/}
                            {/*        Featured*/}
                            {/*    </Badge>*/}
                            {/*)}*/}
                            {/*{novel.is_trending && !novel.is_featured && (*/}
                            {/*    <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600">*/}
                            {/*        <TrendingUp className="mr-1 h-3 w-3" />*/}
                            {/*        Trending*/}
                            {/*    </Badge>*/}
                            {/*)}*/}
                        </div>

                        {/* /!*Action Buttons *!/*/}
                        {/*<div className="mt-4 space-y-2">*/}
                        {/*    {isAuthenticated && hasStartedReading ? (*/}
                        {/*        <Button*/}
                        {/*            onClick={handleContinueReading}*/}
                        {/*            className="w-full"*/}
                        {/*            size="lg"*/}
                        {/*        >*/}
                        {/*            <Play className="mr-2 h-4 w-4" />*/}
                        {/*            Continue Reading*/}
                        {/*        </Button>*/}
                        {/*    ) : (*/}
                        {/*        <Button*/}
                        {/*            onClick={handleStartReading}*/}
                        {/*            className="w-full"*/}
                        {/*            size="lg"*/}
                        {/*            disabled={!novel.chapters || novel.chapters.length === 0}*/}
                        {/*        >*/}
                        {/*            <BookOpen className="mr-2 h-4 w-4" />*/}
                        {/*            Start Reading*/}
                        {/*        </Button>*/}
                        {/*    )}*/}

                        {/*    <div className="flex gap-2">*/}
                        {/*        <LibraryActionButton novel={novel} />*/}
                        {/*        <ShareButton*/}
                        {/*            title={novel.title}*/}
                        {/*            description={`Check out "${novel.title}" by ${novel.author}. ${novel.description ? novel.description.slice(0, 100) + "..." : ""}`}*/}
                        {/*            variant="outline"*/}
                        {/*            size="icon"*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*/!* Reading Progress *!/*/}
                        {/*{isAuthenticated && readingProgress && hasStartedReading && (*/}
                        {/*    <Card className="mt-4">*/}
                        {/*        <CardContent className="p-4">*/}
                        {/*            <div className="space-y-2">*/}
                        {/*                <div className="flex items-center justify-between text-sm">*/}
                        {/*                    <span>Reading Progress</span>*/}
                        {/*                    <span>*/}
                        {/*                        {formatProgressPercentage(*/}
                        {/*                            readingProgress.progress_percentage,*/}
                        {/*                        )}*/}
                        {/*                    </span>*/}
                        {/*                </div>*/}
                        {/*                <Progress*/}
                        {/*                    value={readingProgress.progress_percentage}*/}
                        {/*                    className="h-2"*/}
                        {/*                />*/}
                        {/*                <div className="text-muted-foreground text-xs">*/}
                        {/*                    {readingProgress.current_chapter ? (*/}
                        {/*                        <>*/}
                        {/*                            Chapter{" "}*/}
                        {/*                            {readingProgress.current_chapter.chapter_number}:{" "}*/}
                        {/*                            {readingProgress.current_chapter.title}*/}
                        {/*                        </>*/}
                        {/*                    ) : (*/}
                        {/*                        "Not started yet"*/}
                        {/*                    )}*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*)}*/}
                    </div>
                </div>

                {/* Novel Info */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold lg:text-4xl">
                                {novel.title}
                            </h1>
                            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-lg">
                                <User className="h-4 w-4" />
                                <span>by {typeof novel.authorName === "string" ? novel.authorName : novel.author?.name}</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {/*{novel.rating !== null && novel.rating !== undefined && (*/}
                            {/*    <div className="bg-muted rounded-lg p-3 text-center">*/}
                            {/*        <div className="flex items-center justify-center gap-1 text-lg font-semibold">*/}
                            {/*            <Star className="h-4 w-4 fill-current text-yellow-400" />*/}
                            {/*            {formatRating(novel.rating)}*/}
                            {/*        </div>*/}
                            {/*        <div className="text-muted-foreground text-xs">*/}
                            {/*            {novel.rating_count !== null &&*/}
                            {/*            novel.rating_count !== undefined*/}
                            {/*                ? `${formatNumber(novel.rating_count)} ratings`*/}
                            {/*                : "Rating"}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            {novel.totalChapters !== null &&
                                novel.totalChapters !== undefined && (
                                    <div className="bg-muted rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                                            <BookOpen className="h-4 w-4" />
                                            {novel.totalChapters}
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                            Chapters
                                        </div>
                                    </div>
                                )}

                            {novel.views !== null && novel.views !== undefined && (
                                <div className="bg-muted rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                                        <Eye className="h-4 w-4" />
                                        {formatNumber(novel.views)}
                                    </div>
                                    <div className="text-muted-foreground text-xs">Views</div>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {/*<div className="flex flex-wrap gap-2">*/}
                        {/*    {novel.genres.map((genre) => (*/}
                        {/*        <Link key={genre.id} href={`/genres?genre=${genre.slug}`}>*/}
                        {/*            <Badge*/}
                        {/*                variant="secondary"*/}
                        {/*                className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"*/}
                        {/*                style={{*/}
                        {/*                    backgroundColor: `${genre.color}20`,*/}
                        {/*                    borderColor: genre.color,*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                {genre.name}*/}
                        {/*            </Badge>*/}
                        {/*        </Link>*/}
                        {/*    ))}*/}
                        {/*</div>*/}

                        {/* Description */}
                        {novel.description && (
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {novel.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Metadata */}
                        <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Published:{" "}
                                    {formatDate(novel.publishedAt || novel.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Updated: {formatDate(novel.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />
        </div>
    )
}