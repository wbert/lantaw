// fe/app/page.tsx
// @ts-nocheck
export const dynamic = "force-dynamic";
import Image from "next/image";
import { api } from "@/lib/api";
import { Layout } from "@/components/layouts/layout";
import MediaGrid from "@/components/media-grid";

type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
};

type PopularResponse = {
  results: TmdbItem[];
};

export const revalidate = 60;

export default async function HomePage() {
  const [popularMovies, popularTV] = await Promise.all([
    api<PopularResponse>(
      "/v1/discover?type=movie&sort_by=popularity.desc&page=1",
    ),
    api<PopularResponse>("/v1/discover?type=tv&sort_by=popularity.desc&page=1"),
  ]);

  const hero = popularMovies.results[0];

  return (
    <Layout>
      <div className="space-y-8">
        {/* HERO – smaller height + real content */}
        <section className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-muted">
          {hero?.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w1280${hero.backdrop_path}`}
              alt={hero.title || hero.name || "Popular today"}
              fill
              className="object-cover"
              priority
            />
          )}

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />

          <div className="relative h-full flex items-center md:items-end">
            <div className="p-5 md:p-8 max-w-xl space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Popular Today
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {hero?.title || hero?.name || "Trending now"}
              </h1>
              {hero?.overview && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
                  {hero.overview}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* POPULAR MOVIES */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6">
          <MediaGrid
            title="Popular Movies"
            items={popularMovies.results.slice(0, 12)}
            mediaType="movie"
          />
        </div>

        {/* POPULAR TV SHOWS */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6">
          <MediaGrid
            title="Popular TV Shows"
            items={popularTV.results.slice(0, 12)}
            mediaType="tv"
          />
        </div>
      </div>
    </Layout>
  );
}
