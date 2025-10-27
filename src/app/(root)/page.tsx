'use client'

import {HeroSection} from "@/components/HeroSection";
import {NovelsTabs} from "@/components/novels/NovelsTabs";
import {SectionHeader} from "@/components/sections/SectionHeader";
import {TrendingUp} from "lucide-react";
import {NovelGrid} from "@/components/novels/NovelGrid";
import {useNovelContext} from "@/context/NovelContext";

export default function Home() {
    const { novels, isLoading } = useNovelContext();
    return (
      <div className="">
          <HeroSection />
          <section className="py-12 lg:py-16">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <SectionHeader
                      title="Featured Novels"
                      icon={TrendingUp}
                      viewAllHref="/top-rated"
                  />

                  <NovelGrid
                      novels={novels}
                      loading={isLoading}
                      size="featured"
                      maxItems={3}
                      skeletonCount={3}
                  />
              </div>
          </section>
          <section className="bg-muted/20 py-12 lg:py-16">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <NovelsTabs maxItems={10} novels={novels} loading={isLoading} />

                  {/*<div className="mt-8 text-center">*/}
                  {/*    <Link href="/search">*/}
                  {/*        <Button variant="outline" size="lg">*/}
                  {/*            Explore More Novels*/}
                  {/*        </Button>*/}
                  {/*    </Link>*/}
                  {/*</div>*/}
              </div>
          </section>
      </div>
    );
}
