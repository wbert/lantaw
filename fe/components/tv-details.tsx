// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import MediaGrid from "./media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "./layouts/layout";

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbCountry = {
  iso_3166_1: string;
  name: string;
};

type TmdbSeason = {
  season_number: number;
  episode_count: number;
  air_date: string | null;
  name: string;
  poster_path: string | null;
};

type TmdbCredit = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

type TmdbVideo = {
  id: string;
  key: string;
  site: string;
  type: string;
};

type TmdbTVDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: TmdbGenre[];
  production_countries: TmdbCountry[];
  seasons: TmdbSeason[];
};

type TVDetailsProps = {
  details: TmdbTVDetails;
  credits: { cast: TmdbCredit[] };
  videos: { results: TmdbVideo[] };
  recommendations: { results: TmdbTVDetails[] };
};

export default function TVDetails({
  details,
  credits,
  videos,
  recommendations,
}: TVDetailsProps) {
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/logo.svg";

  const firstAirYear = details.first_air_date?.slice(0, 4) ?? "";
  const lastAirYear = details.last_air_date?.slice(0, 4) ?? "";
  const airLabel =
    firstAirYear && lastAirYear ? `${firstAirYear} - ${lastAirYear}` : firstAirYear;

  const genres = details.genres.map((g) => g.name).join(" · ");
  const topCast = credits.cast.slice(0, 10);

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    ) ?? null;

  return (
    <Layout>
      <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
        <section className="cinema-panel relative overflow-hidden rounded-3xl px-4 py-5 md:px-7 md:py-8">
          <div className="absolute inset-0">
            {backdropUrl ? (
              <Image src={backdropUrl} alt={details.name} fill priority className="object-cover" />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
            <div className="hero-fade absolute inset-0" />
          </div>

          <div className="relative z-10 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-end">
            <div className="mx-auto w-[180px] md:mx-0 md:w-[220px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-xl">
                <Image src={posterUrl} alt={details.name} fill className="object-cover" />
              </div>
            </div>

            <div className="space-y-3 text-white">
              <div className="space-y-2">
                <h1 className="font-display text-5xl leading-[0.9] md:text-7xl">{details.name}</h1>

                <div className="flex flex-wrap items-center gap-2">
                  {airLabel && (
                    <Badge className="rounded-full bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                      {airLabel}
                    </Badge>
                  )}
                  <Badge className="rounded-full bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                    ⭐ {details.vote_average.toFixed(1)} · {details.vote_count.toLocaleString()} votes
                  </Badge>
                  <Badge className="rounded-full bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                    {details.number_of_seasons} seasons · {details.number_of_episodes} episodes
                  </Badge>
                </div>
              </div>

              {details.overview && (
                <p className="max-w-3xl text-sm text-white/84 md:text-base">{details.overview}</p>
              )}

              <div className="space-y-2 text-xs text-white/80 md:text-sm">
                {genres && <p>{genres}</p>}
                {details.production_countries.length > 0 && (
                  <p>
                    Countries: {details.production_countries.map((c) => c.name).join(", ")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button asChild size="sm" className="rounded-full px-4 text-xs uppercase tracking-[0.14em]">
                  <Link href={`/tv/${details.id}/play/mirror-1`}>Mirror 1</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/35 bg-black/35 px-4 text-xs uppercase tracking-[0.14em] text-white hover:bg-black/50"
                >
                  <Link href={`/tv/${details.id}/play/mirror-2`}>Mirror 2</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/35 bg-black/35 px-4 text-xs uppercase tracking-[0.14em] text-white hover:bg-black/50"
                >
                  <Link href={`/tv/${details.id}/play/mirror-3`}>Mirror 3</Link>
                </Button>

                {trailer && (
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Trailer
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {topCast.length > 0 && (
          <section className="cinema-panel rounded-2xl p-4 md:p-6">
            <h2 className="mb-4 font-display text-4xl leading-none">Top Cast</h2>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {topCast.map((person) => {
                const avatar = person.profile_path
                  ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                  : "/logo.svg";

                return (
                  <div
                    key={person.id}
                    className="w-32 flex-shrink-0 rounded-xl border border-border/55 bg-card/55 p-2 text-center"
                  >
                    <div className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border border-border/60">
                      <Image src={avatar} alt={person.name} fill className="object-cover" />
                    </div>
                    <p className="truncate text-xs font-semibold">{person.name}</p>
                    {person.character && (
                      <p className="truncate text-[11px] text-muted-foreground">as {person.character}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {recommendations.results.length > 0 && (
          <section className="cinema-panel rounded-2xl p-4 md:p-6">
            <MediaGrid
              items={recommendations.results}
              mediaType="tv"
              title="You Might Also Like"
            />
          </section>
        )}
      </div>
    </Layout>
  );
}
