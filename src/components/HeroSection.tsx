import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {BookOpen, Filter} from "lucide-react";
import {Spotlight} from "@/components/ui/spotlight-new";

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    className?: string;
}

export function HeroSection({
    title = "Discover Amazing",
    subtitle = "Web Novels",
    description = "Immerse yourself in captivating stories from talented authors around the world. Read, discover, and fall in love with your next favorite novel.",
    primaryButtonText = "Start Reading",
    primaryButtonHref = "/search",
    secondaryButtonText = "Browse Genres",
    secondaryButtonHref = "/genres",
    className,
}: HeroSectionProps) {
    return (
        <section className={cn("max-w-full py-12 lg:py-20", className)}>
            <div className="absolute inset-0 overflow-hidden">
            <Spotlight
                gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(340, 100%, 85%, .08) 0%, hsla(340, 100%, 55%, .02) 50%, hsla(340, 100%, 45%, 0) 80%)"
                gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(340, 100%, 85%, .06) 0%, hsla(340, 100%, 55%, .02) 80%, transparent 100%)"
                gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(340, 100%, 85%, .04) 0%, hsla(340, 100%, 45%, .02) 80%, transparent 100%)"
            />
            </div>
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl space-y-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                        {title}
                        <span className="text-primary block">{subtitle}</span>
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                        {description}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href={primaryButtonHref}>
                            <Button size="lg" className="w-full sm:w-auto">
                                <BookOpen className="mr-2 h-5 w-5" />
                                {primaryButtonText}
                            </Button>
                        </Link>
                        <Link href={secondaryButtonHref}>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Filter className="mr-2 h-5 w-5" />
                                {secondaryButtonText}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}