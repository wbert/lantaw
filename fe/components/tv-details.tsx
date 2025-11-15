import Image from "next/image";
import Link from "next/link";
import MediaGrid from "./media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    : "/no-poster.png";

  const firstAirYear = details.first_air_date?.slice(0, 4) ?? "";
  const lastAirYear = details.last_air_date?.slice(0, 4) ?? "";
  const airLabel =
    firstAirYear && lastAirYear
      ? `${firstAirYear} - ${lastAirYear}`
      : firstAirYear;

  const genres = details.genres.map((g) => g.name).join(" · ");
  const topCast = credits.cast.slice(0, 10);

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    ) ?? null;

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* HERO */}
        <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={details.name}
              fill
              priority
              className="object-cover"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

          {/* Content */}
          <div className="relative h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-6 md:gap-10">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <div className="relative w-[220px] aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-border/60 bg-muted">
                <Image
                  src={posterUrl}
                  alt={details.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text area */}
            <div className="flex-1 space-y-4 md:space-y-5">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {details.name}{" "}
                  {firstAirYear && (
                    <span className="text-muted-foreground text-2xl md:text-3xl">
                      ({airLabel})
                    </span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  {/* Rating */}
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

                  {/* Genres */}
                  {genres && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2 py-0.5"
                    >
                      {genres}
                    </Badge>
                  )}

                  {/* Seasons + Episodes */}
                  <Badge variant="outline" className="rounded-full px-2 py-0.5">
                    {details.number_of_seasons} season
                    {details.number_of_seasons > 1 ? "s" : ""},{" "}
                    {details.number_of_episodes} episodes
                  </Badge>
                </div>
              </div>

              {/* Overview */}
              {details.overview && (
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                  {details.overview}
                </p>
              )}

              {/* Countries */}
              {details.production_countries.length > 0 && (
                <p className="text-xs md:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Countries:
                  </span>{" "}
                  {details.production_countries.map((c) => c.name).join(", ")}
                </p>
              )}

              <Separator className="my-2 opacity-60" />

              {/* Mirrors */}
              <div className="mt-2 flex flex-wrap gap-3 items-center">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Mirrors:
                </span>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-4 py-1.5 text-xs"
                >
                  <Link href={`/tv/${details.id}/play/mirror-1`}>Mirror 1</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4 py-1.5 text-xs"
                >
                  <Link href={`/tv/${details.id}/play/mirror-2`}>Mirror 2</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4 py-1.5 text-xs"
                >
                  <Link href={`/tv/${details.id}/play/mirror-3`}>Mirror 3</Link>
                </Button>

                {/* Trailer */}
                {trailer && (
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="rounded-full px-4 py-1.5 text-xs md:text-sm ml-1"
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
        <section className="md:hidden max-w-6xl mx-auto px-4 md:px-6 mt-4 flex justify-center">
          <div className="relative w-[180px] aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-border/60 bg-muted">
            <Image
              src={posterUrl}
              alt={details.name}
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* CAST */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
          {topCast.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Top Cast
              </h2>

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
        {recommendations.results.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
            <MediaGrid
              items={recommendations.results}
              mediaType="tv"
              title="You might also like"
            />
          </section>
        )}
      </div>
    </Layout>
  );
}
