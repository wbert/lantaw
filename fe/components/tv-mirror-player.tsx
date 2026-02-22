// @ts-nocheck
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import MediaGrid from "./media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const playableSeasons = useMemo(
    () => details.seasons.filter((s) => s.episode_count > 0 && s.season_number >= 1),
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

  const [activeMirrorId, setActiveMirrorId] = useState<string>(
    MIRRORS.some((m) => m.id === (initialMirror ?? ""))
      ? (initialMirror as string)
      : MIRRORS[0].id,
  );

  const activeMirror = MIRRORS.find((m) => m.id === activeMirrorId) ?? MIRRORS[0];

  useEffect(() => {
    if (episode > episodeCount) {
      setEpisode(1);
    }
  }, [episodeCount, episode]);

  const embedSrc = activeMirror.buildUrl({ tvId, season, episode });

  const firstAirYear = details.first_air_date?.slice(0, 4) ?? "";
  const lastAirYear = details.last_air_date?.slice(0, 4) ?? "";
  const airLabel =
    firstAirYear && lastAirYear ? `${firstAirYear} - ${lastAirYear}` : firstAirYear;

  const genres = details.genres.map((g) => g.name).join(" · ");

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    ) ?? null;

  return (
    <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
      <section className="cinema-panel rounded-2xl p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-display text-4xl leading-none md:text-5xl">{details.name}</h1>
            <div className="flex flex-wrap gap-2">
              {airLabel && (
                <Badge
                  variant="outline"
                  className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
                >
                  {airLabel}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                ⭐ {details.vote_average.toFixed(1)}
              </Badge>
            </div>
          </div>

          <Button variant="outline" size="sm" asChild className="rounded-full px-4 text-xs uppercase tracking-[0.14em]">
            <Link href={`/tv/${tvId}`}>Back to Details</Link>
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {MIRRORS.map((mirror) => (
            <Button
              key={mirror.id}
              type="button"
              size="sm"
              variant={mirror.id === activeMirrorId ? "default" : "outline"}
              className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
              onClick={() => setActiveMirrorId(mirror.id)}
            >
              {mirror.label}
            </Button>
          ))}
          <span className="text-[11px] text-muted-foreground">Source: {activeMirror.note}</span>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black">
          <iframe
            src={embedSrc}
            title={`${details.name} - S${season}E${episode} (${activeMirror.label})`}
            className="h-full w-full"
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            {details.overview && (
              <p className="text-sm text-muted-foreground md:text-base">{details.overview}</p>
            )}
            {trailer && (
              <p className="text-xs text-muted-foreground">
                Trailer: {" "}
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  YouTube
                </a>
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-card/55 p-3 text-xs text-muted-foreground">
            <p>{genres}</p>
            <p className="mt-2">
              {details.number_of_seasons} seasons · {details.number_of_episodes} episodes
            </p>
          </div>
        </div>
      </section>

      <section className="cinema-panel rounded-2xl p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl leading-none md:text-4xl">Season Picker</h2>
            {currentSeason && (
              <p className="mt-1 text-xs text-muted-foreground">
                Season {currentSeason.season_number} · {currentSeason.episode_count} episodes
              </p>
            )}
          </div>

          <Select
            value={season.toString()}
            onValueChange={(value) => setSeason(parseInt(value, 10))}
          >
            <SelectTrigger className="w-full rounded-full border-border/60 bg-card/65 sm:w-[250px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {playableSeasons.map((s) => (
                <SelectItem key={s.season_number} value={s.season_number.toString()}>
                  Season {s.season_number} ({s.episode_count} ep
                  {s.episode_count > 1 ? "s" : ""})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                className="rounded-full px-3 text-xs uppercase tracking-[0.12em]"
                onClick={() => setEpisode(epNo)}
              >
                Ep {epNo}
              </Button>
            );
          })}
        </div>
      </section>

      {recommendations.results?.length > 0 && (
        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <MediaGrid
            items={recommendations.results}
            mediaType="tv"
            title="Watch Next"
          />
        </section>
      )}
    </div>
  );
}
