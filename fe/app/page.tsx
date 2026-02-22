// @ts-nocheck
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Layout } from "@/components/layouts/layout";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

type PopularResponse = {
  results: TmdbItem[];
};

export const revalidate = 60;

export default async function HomePage() {
  const [popularMovies, popularTV, awardMovies] = await Promise.all([
    api<PopularResponse>(
      "/v1/discover?type=movie&sort_by=popularity.desc&page=1",
    ),
    api<PopularResponse>("/v1/discover?type=tv&sort_by=popularity.desc&page=1"),
    api<PopularResponse>(
      "/v1/discover?type=movie&sort_by=vote_average.desc&page=1&vote_count.gte=600",
    ),
  ]);

  const hero = popularMovies.results[0] ?? popularTV.results[0];
  const heroTitle = hero?.title || hero?.name || "Tonight's spotlight";
  const heroYear = hero?.release_date?.slice(0, 4) || hero?.first_air_date?.slice(0, 4);
  const heroMediaType = hero?.title ? "movie" : "tv";

  return (
    <Layout>
      <div className="mx-auto mt-4 max-w-7xl space-y-7 px-3 md:mt-5 md:space-y-8 md:px-4">
        <section className="cinema-panel relative overflow-hidden rounded-3xl px-4 py-5 md:px-8 md:py-8">
          <div className="absolute inset-0">
            {hero?.backdrop_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w1280${hero.backdrop_path}`}
                alt={heroTitle}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
            <div className="hero-fade absolute inset-0" />
          </div>

          <div className="relative z-10 flex min-h-[260px] items-end md:min-h-[360px]">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                  Featured Pick
                </Badge>
                {heroYear && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/35 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white"
                  >
                    {heroYear}
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-5xl leading-[0.9] text-white drop-shadow-md md:text-7xl">
                {heroTitle}
              </h1>

              {hero?.overview && (
                <p className="max-w-xl text-sm text-white/82 md:text-base">
                  {hero.overview}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {hero?.id && (
                  <Button asChild className="rounded-full px-5 text-xs uppercase tracking-[0.14em]">
                    <Link href={`/${heroMediaType}/${hero.id}`}>Watch Details</Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/35 bg-black/30 px-5 text-xs uppercase tracking-[0.14em] text-white hover:bg-black/45"
                >
                  <Link href="/browse?mediaType=movie">Browse Library</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <MediaGrid
            title="Trending Movies"
            items={popularMovies.results.slice(0, 12)}
            mediaType="movie"
          />
        </section>

        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <MediaGrid
            title="Binge-Worthy Series"
            items={popularTV.results.slice(0, 12)}
            mediaType="tv"
          />
        </section>

        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <MediaGrid
            title="Top Rated Spotlight"
            items={awardMovies.results.slice(0, 12)}
            mediaType="movie"
          />
        </section>
      </div>
    </Layout>
  );
}
