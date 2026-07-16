// @ts-nocheck
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Layout } from "@/components/layouts/layout";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";

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
      <div className="page-shell mt-4 space-y-2 md:mt-6">
        <section className="home-console">
          <div className="home-console__copy">
            <span className="soft-chip w-fit">Lantaw stream index</span>
            <div className="space-y-3">
              <h1 className="font-display text-[length:var(--text-display)] leading-[0.92]">
                Find the next title before the couch goes cold.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Search movies and series, filter by genre or language, then open a mirror
                from the detail page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hero?.id && (
                <Button asChild className="rounded-full px-5 text-xs font-semibold uppercase tracking-[0.12em]">
                  <Link href={`/${heroMediaType}/${hero.id}`}>Open spotlight</Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="rounded-full px-5 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                <Link href="/browse?mediaType=movie">Browse filters</Link>
              </Button>
            </div>
          </div>

          <Link
            href={hero?.id ? `/${heroMediaType}/${hero.id}` : "/movies"}
            className="home-console__poster lift-link block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
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
            <div className="relative z-10 flex h-full items-end p-4 md:p-6">
              <div className="max-w-2xl space-y-3 text-[color:var(--color-hero-ink)]">
                <div className="flex flex-wrap gap-2">
                  <span className="media-chip">Spotlight</span>
                  {heroYear && <span className="media-chip">{heroYear}</span>}
                </div>
                <h2 className="font-display text-5xl leading-[0.92] md:text-7xl">
                  {heroTitle}
                </h2>
                {hero?.overview && (
                  <p className="line-clamp-3 max-w-xl text-sm leading-6 md:text-base">
                    {hero.overview}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>

        <section className="content-rail">
          <MediaGrid
            title="Trending movies"
            items={popularMovies.results.slice(0, 12)}
            mediaType="movie"
          />
        </section>

        <section className="content-rail">
          <MediaGrid
            title="Series people keep opening"
            items={popularTV.results.slice(0, 12)}
            mediaType="tv"
          />
        </section>

        <section className="content-rail">
          <MediaGrid
            title="High-rated movies"
            items={awardMovies.results.slice(0, 12)}
            mediaType="movie"
          />
        </section>
      </div>
    </Layout>
  );
}
