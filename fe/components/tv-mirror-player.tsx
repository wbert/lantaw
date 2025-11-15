// @ts-nocheck
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import MediaGrid from "./media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbSeason = {
  season_number: number;
  episode_count: number;
  air_date: string | null;
  name: string;
  poster_path: string | null;
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
  seasons: TmdbSeason[];
};

type TVMirrorPlayerProps = {
  tvId: number;
  details: TmdbTVDetails;
  videos: { results: TmdbVideo[] };
  recommendations: { results: TmdbTVDetails[] };
  initialMirror?: string;
};

type MirrorConfig = {
  id: string;
  label: string;
  buildUrl: (args: { tvId: number; season: number; episode: number }) => string;
  note?: string;
};

const MIRRORS: MirrorConfig[] = [
  {
    id: "mirror-1",
    label: "Mirror 1",
    buildUrl: ({ tvId, season, episode }) =>
      `https://vidlink.pro/tv/${tvId}/${season}/${episode}`,
    note: "vidlink.pro",
  },
  {
    id: "mirror-2",
    label: "Mirror 2",
    buildUrl: ({ tvId, season, episode }) =>
      `https://vidsrc.cc/v2/embed/tv/${tvId}/${season}/${episode}?autoPlay=false`,
    note: "vidsrc.cc",
  },
  {
    id: "mirror-3",
    label: "Mirror 3",
    buildUrl: ({ tvId, season, episode }) =>
      `https://vidsrc.to/embed/tv/${tvId}/${season}/${episode}`,
    note: "vidsrc.to",
  },
];

export default function TVMirrorPlayer({
  tvId,
  details,
  videos,
  recommendations,
  initialMirror,
}: TVMirrorPlayerProps) {
  // filter seasons (exclude specials season 0)
  const playableSeasons = useMemo(
    () =>
      details.seasons.filter(
        (s) => s.episode_count > 0 && s.season_number >= 1,
      ),
    [details.seasons],
  );

  const defaultSeason = playableSeasons[0]?.season_number ?? 1;
  const [season, setSeason] = useState<number>(defaultSeason);
  const [episode, setEpisode] = useState<number>(1);

  const currentSeason = useMemo(
    () => playableSeasons.find((s) => s.season_number === season),
    [playableSeasons, season],
  );

  const episodeCount = currentSeason?.episode_count ?? 1;

  // mirror state (use initialMirror if valid, else first mirror)
  const [activeMirrorId, setActiveMirrorId] = useState<string>(
    MIRRORS.some((m) => m.id === (initialMirror ?? ""))
      ? (initialMirror as string)
      : MIRRORS[0].id,
  );
  const activeMirror =
    MIRRORS.find((m) => m.id === activeMirrorId) ?? MIRRORS[0];

  // reset episode when season changes and old ep is out of range
  useEffect(() => {
    if (episode > episodeCount) {
      setEpisode(1);
    }
  }, [episodeCount, episode]);

  const embedSrc = activeMirror.buildUrl({ tvId, season, episode });

  const firstAirYear = details.first_air_date?.slice(0, 4) ?? "";
  const lastAirYear = details.last_air_date?.slice(0, 4) ?? "";
  const airLabel =
    firstAirYear && lastAirYear
      ? `${firstAirYear} - ${lastAirYear}`
      : firstAirYear;

  const genres = details.genres.map((g) => g.name).join(" · ");

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    ) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {activeMirror.label} · TV
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              {details.name}{" "}
              {airLabel && (
                <span className="text-muted-foreground text-lg md:text-xl ml-1.5">
                  ({airLabel})
                </span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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

              <Badge variant="outline" className="rounded-full px-2 py-0.5">
                {details.number_of_seasons} season
                {details.number_of_seasons > 1 ? "s" : ""},{" "}
                {details.number_of_episodes} episodes total
              </Badge>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href={`/tv/${tvId}`}>← Back to TV details</Link>
          </Button>
        </div>

        {/* MIRROR SWITCHER */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Mirrors:
          </span>
          {MIRRORS.map((mirror) => (
            <Button
              key={mirror.id}
              type="button"
              size="sm"
              variant={mirror.id === activeMirrorId ? "default" : "outline"}
              className="rounded-full px-3 py-1 text-xs md:text-sm"
              onClick={() => setActiveMirrorId(mirror.id)}
            >
              {mirror.label}
            </Button>
          ))}
          {activeMirror.note && (
            <span className="text-[10px] text-muted-foreground ml-1">
              Source: {activeMirror.note}
            </span>
          )}
        </div>

        {/* PLAYER */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-border/60">
          <iframe
            src={embedSrc}
            title={`${details.name} - S${season}E${episode} (${activeMirror.label})`}
            className="w-full h-full"
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* META / OVERVIEW */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-muted-foreground">
            {genres && (
              <>
                <span>{genres}</span>
              </>
            )}
          </div>

          {details.overview && (
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
              {details.overview}
            </p>
          )}

          {trailer && (
            <p className="text-xs text-muted-foreground">
              Trailer available on YouTube:{" "}
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                watch trailer
              </a>
            </p>
          )}
        </section>

        <Separator />

        {/* SEASON + EPISODE PICKER */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Select season & episode
              </h2>
              {currentSeason && (
                <p className="text-xs text-muted-foreground mt-1">
                  Season {currentSeason.season_number} ·{" "}
                  {currentSeason.episode_count} episode
                  {currentSeason.episode_count > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {playableSeasons.map((s) => (
                <Button
                  key={s.season_number}
                  type="button"
                  size="sm"
                  variant={s.season_number === season ? "default" : "outline"}
                  className="rounded-full px-3 py-1 text-xs md:text-sm"
                  onClick={() => setSeason(s.season_number)}
                >
                  S{s.season_number} ({s.episode_count})
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: episodeCount }).map((_, idx) => {
              const epNo = idx + 1;
              const isActive = epNo === episode;
              return (
                <Button
                  key={epNo}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="px-2.5 py-1 rounded-md text-xs"
                  onClick={() => setEpisode(epNo)}
                >
                  Ep {epNo}
                </Button>
              );
            })}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        {recommendations.results?.length > 0 && (
          <section className="pb-8">
            <MediaGrid
              items={recommendations.results}
              mediaType="tv"
              title="You might also like"
            />
          </section>
        )}
      </div>
    </div>
  );
}
