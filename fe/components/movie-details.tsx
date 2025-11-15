// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import MediaGrid from "./media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbCountry = {
  iso_3166_1: string;
  name: string;
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number | null;
  genres: TmdbGenre[];
  production_countries: TmdbCountry[];
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
  official?: boolean;
};

type MovieDetailsProps = {
  details: TmdbMovieDetails;
  credits: { cast: TmdbCredit[] };
  videos: { results: TmdbVideo[] };
  recommendations: { results: TmdbMovieDetails[] };
};

export default function MovieDetails({
  details,
  credits,
  videos,
  recommendations,
}: MovieDetailsProps) {
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/no-poster.png";

  const year = details.release_date?.slice(0, 4) ?? "";
  const runtime =
    details.runtime != null ? `${details.runtime} min` : "Runtime N/A";
  const genres = details.genres.map((g) => g.name).join(" · ");

  const topCast = credits.cast.slice(0, 8);

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    ) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={details.title}
            fill
            priority
            className="object-cover"
          />
        )}

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/10" />

        {/* content */}
        <div className="relative h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-6 md:gap-10">
          {/* poster */}
          <div className="hidden md:block flex-shrink-0">
            <div className="relative w-[220px] aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-border/60 bg-muted">
              <Image
                src={posterUrl}
                alt={details.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* text */}
          <div className="flex-1 space-y-4 md:space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {details.title}{" "}
                {year && (
                  <span className="text-muted-foreground text-2xl md:text-3xl">
                    ({year})
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-full px-2 py-0.5"
                >
                  <span>⭐</span>
                  <span className="font-semibold text-foreground">
                    {details.vote_average.toFixed(1)}
                  </span>
                  <span className="text-[10px]">
                    ({details.vote_count.toLocaleString()} votes)
                  </span>
                </Badge>

                {genres && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 py-0.5"
                  >
                    {genres}
                  </Badge>
                )}

                <Badge variant="outline" className="rounded-full px-2 py-0.5">
                  {runtime}
                </Badge>
              </div>
            </div>

            {details.overview && (
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                {details.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">
              {details.production_countries?.length > 0 && (
                <span>
                  <span className="font-semibold text-foreground">
                    Countries:
                  </span>{" "}
                  {details.production_countries.map((c) => c.name).join(", ")}
                </span>
              )}
            </div>

            <Separator className="my-2 opacity-60" />

            {/* Mirrors + Trailer */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Mirrors:
              </span>

              <Button
                asChild
                size="sm"
                className="rounded-full px-4 py-1.5 text-xs"
              >
                <Link href={`/movie/${details.id}/play/mirror-1`}>
                  Mirror 1
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full px-4 py-1.5 text-xs"
              >
                <Link href={`/movie/${details.id}/play/mirror-2`}>
                  Mirror 2
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full px-4 py-1.5 text-xs"
              >
                <Link href={`/movie/${details.id}/play/mirror-3`}>
                  Mirror 3
                </Link>
              </Button>

              {trailer && (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="rounded-full px-4 py-1.5 text-xs md:text-sm"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶ Watch Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE POSTER */}
      <section className="md:hidden max-w-6xl mx-auto px-4 md:px-6 mt-4">
        <div className="flex justify-center">
          <div className="relative w-[180px] aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-border/60 bg-muted">
            <Image
              src={posterUrl}
              alt={details.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CAST & DETAILS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        {topCast.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {topCast.map((person) => {
                const avatar = person.profile_path
                  ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                  : "/avatar-placeholder.png";
                return (
                  <div
                    key={person.id}
                    className="flex-shrink-0 w-28 text-center"
                  >
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-2 bg-muted border border-border/60">
                      <Image
                        src={avatar}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium truncate">
                      {person.name}
                    </p>
                    {person.character && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        as {person.character}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* RECOMMENDATIONS */}
      {recommendations.results?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
          <MediaGrid
            items={recommendations.results}
            mediaType="movie"
            title="You might also like"
          />
        </section>
      )}
    </div>
  );
}
