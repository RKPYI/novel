import {Novel} from ".prisma/client";
import Link from "next/link";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {BookOpen, Eye} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {NovelStatus} from "@prisma/client";
import {formatBigNumber, truncateDescription} from "@/lib/helpers/novelHelpers";

interface NovelCardProps {
    novel: Novel;
    size?: "default" | "compact" | "featured";
    className?: string;
}

export function NovelCard({ novel, size = "default", className }: NovelCardProps) {
    const isFeatured = size === "featured";
    const isCompact = size === "compact";
    return (
        <Link
            href={`/novels/${novel.slug}`}
            className="focus-visible:ring-ring block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:rign-offset-2"
        >
            <Card
                className={cn("group relative overflow-hidden transition-all duration-300 focus-withing:scale-[1.02] focus-within:shadow-lg hover:scale-[1.02] hover:shadow-lg pt-0",
                    isFeatured && "border-primary/20",
                    isCompact ? "h-auto" : "h-full",
                    className
                )}
            >
                <div
                    className={cn("relative overflow-hidden",
                        isCompact ? "aspect-[3/2]" : "aspect-[2/3]",
                        isFeatured && "aspect-[2/3]",
                    )}
                >
                    {novel.coverUrl ? (
                        <Image
                            src={novel.coverUrl}
                            alt={novel.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                        />
                    ) : (
                        <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-gradient-to-br">
                            <BookOpen className="text-muted-foreground h-12 w-12" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <Badge
                        variant={
                            novel.status === NovelStatus.COMPLETED
                                ? "default"
                                : novel.status === NovelStatus.ONGOING
                                    ? "secondary"
                                    : "outline"
                        }
                        className="absolute top-2 left-2 text-xs"
                        tabIndex={-1}
                    >
                        {novel.status.toUpperCase()}
                    </Badge>

                    {/* Overlay for featured cards */}
                    {isFeatured && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    )}
                </div>

                <CardContent className={cn("p-4", isCompact && "p-3")}>
                    <div className="space-y-2">
                        <div>
                            <h3
                                className={cn(
                                    "group-hover:text-primary line-clamp-2 font-semibold transition-colors",
                                    isCompact ? "text-sm" : "text-base",
                                    isFeatured && "text-lg",
                                )}
                            >
                                {novel.title}
                            </h3>
                            <p
                                className={cn(
                                    "text-muted-foreground",
                                    isCompact ? "text-xs" : "text-sm",
                                )}
                            >
                                by {novel.authorName ?? "Anonymous"}
                            </p>
                        </div>

                        {!isCompact && novel.description && (
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                {truncateDescription(novel.description, 100)}
                            </p>
                        )}

                        {/* Genres */}
                        {/*<div className="flex flex-wrap gap-1">*/}
                        {/*    {novel.genres.slice(0, isCompact ? 2 : 3).map((genre) => (*/}
                        {/*        <Badge*/}
                        {/*            key={genre.id}*/}
                        {/*            variant="outline"*/}
                        {/*            className="h-5 text-xs"*/}
                        {/*            tabIndex={-1}*/}
                        {/*        >*/}
                        {/*            {genre.name}*/}
                        {/*        </Badge>*/}
                        {/*    ))}*/}
                        {/*    {novel.genres.length > (isCompact ? 2 : 3) && (*/}
                        {/*        <Badge variant="outline" className="h-5 text-xs" tabIndex={-1}>*/}
                        {/*            +{novel.genres.length - (isCompact ? 2 : 3)}*/}
                        {/*        </Badge>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </div>
                </CardContent>

                <CardFooter
                    className={cn(
                        "flex items-center justify-between px-4 pt-0 pb-4",
                        isCompact && "px-3 pb-3",
                    )}
                >
                    <div className="text-muted-foreground flex items-center gap-3 text-xs">
                        {/*{novel.rating !== null && novel.rating !== undefined && (*/}
                        {/*    <div className="flex items-center gap-1">*/}
                        {/*        <Star className="h-3 w-3 fill-current text-yellow-400" />*/}
                        {/*        <span>{formatRating(novel.rating)}</span>*/}
                        {/*        {novel.rating_count !== null &&*/}
                        {/*            novel.rating_count !== undefined && (*/}
                        {/*                <span>({novel.rating_count})</span>*/}
                        {/*            )}*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {novel.totalChapters !== null &&
                            novel.totalChapters !== undefined && (
                                <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span>{novel.totalChapters} ch</span>
                                </div>
                            )}

                        {novel.views !== null && novel.views !== undefined && (
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>
                                    {formatBigNumber(novel.views)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}