export type MediaKind = "movie" | "tv";

export type PlayerRequestInput = {
  mediaId: number | string;
  imdbId?: string | null;
  season?: number;
  episode?: number;
  autoPlay?: boolean;
};

/** Everything a mirror needs to address one title: both ids TMDB knows the
 *  title by, the episode for series, and the viewer's autoplay preference. */
export type PlayerRequest = {
  mediaId: number | string;
  imdbId: string | null;
  season: number;
  episode: number;
  autoPlay: boolean;
};

export function playerRequest({
  mediaId,
  imdbId = null,
  season = 1,
  episode = 1,
  autoPlay = true,
}: PlayerRequestInput): PlayerRequest {
  return { mediaId, imdbId, season, episode, autoPlay };
}

export type PlayerSource = {
  id: string;
  label: string;
  host: string;
  /** Some mirrors index by IMDb id rather than TMDB id, so they cannot play a
   *  title TMDB has no IMDb id for. Those drop out of the picker instead of
   *  loading a dead embed. */
  needsImdbId?: boolean;
  /** Mirrors take their playback preferences as query parameters, so the URL
   *  has to be rebuilt whenever autoplay is toggled. */
  buildUrl: (request: PlayerRequest) => string;
};

const MOVIE_SOURCES: PlayerSource[] = [
  {
    id: "mirror-1",
    label: "Mirror 1",
    host: "vidlink.pro",
    buildUrl: (r) => `https://vidlink.pro/movie/${r.mediaId}?autoplay=${r.autoPlay}`,
  },
  {
    id: "mirror-2",
    label: "Mirror 2",
    host: "vidsrc.to",
    buildUrl: (r) =>
      `https://vidsrc.to/embed/movie/${r.mediaId}?autoplay=${r.autoPlay ? 1 : 0}`,
  },
  {
    id: "mirror-3",
    label: "Mirror 3",
    host: "cinesrc.st",
    buildUrl: (r) => `https://cinesrc.st/embed/movie/${r.mediaId}`,
  },
  {
    id: "mirror-4",
    label: "Mirror 4",
    host: "vidsrc.cc",
    needsImdbId: true,
    buildUrl: (r) =>
      `https://vidsrc.cc/v2/embed/movie/${r.imdbId}?poster=true&autoPlay=false`,
  },
];

const TV_SOURCES: PlayerSource[] = [
  {
    id: "mirror-1",
    label: "Mirror 1",
    host: "vidlink.pro",
    buildUrl: (r) =>
      `https://vidlink.pro/tv/${r.mediaId}/${r.season}/${r.episode}` +
      `?autoplay=${r.autoPlay}&nextbutton=true`,
  },
  {
    id: "mirror-2",
    label: "Mirror 2",
    host: "cinesrc.st",
    buildUrl: (r) =>
      `https://cinesrc.st/embed/tv/${r.mediaId}?s=${r.season}&e=${r.episode}`,
  },
  {
    id: "mirror-3",
    label: "Mirror 3",
    host: "vidsrc.to",
    buildUrl: (r) =>
      `https://vidsrc.to/embed/tv/${r.mediaId}/${r.season}/${r.episode}` +
      `?autoplay=${r.autoPlay ? 1 : 0}`,
  },
  {
    id: "mirror-4",
    label: "Mirror 4",
    host: "vidsrc.cc",
    needsImdbId: true,
    buildUrl: (r) =>
      `https://vidsrc.cc/v2/embed/tv/${r.imdbId}/${r.season}/${r.episode}` +
      `?poster=true&autoPlay=false`,
  },
];

export function supports(source: PlayerSource, imdbId?: string | null): boolean {
  return !source.needsImdbId || Boolean(imdbId);
}

export function sourcesFor(type: MediaKind): PlayerSource[] {
  return type === "movie" ? MOVIE_SOURCES : TV_SOURCES;
}

/** The mirrors that can actually address this title, in picker order. */
export function availableSources(
  type: MediaKind,
  imdbId?: string | null,
): PlayerSource[] {
  return sourcesFor(type).filter((source) => supports(source, imdbId));
}

/** The mirror a title opens on. The others stay available in the picker, so
 *  this only decides the first attempt. */
export function preferredSource(
  type: MediaKind,
  imdbId?: string | null,
): PlayerSource {
  const sources = availableSources(type, imdbId);
  return sources.find((source) => source.id === "mirror-1") ?? sources[0];
}

/** Resolves a `[mirror]` route segment, falling back to the preferred mirror
 *  when the id is unknown or unusable for this title. */
export function resolveSource(
  type: MediaKind,
  id: string | undefined,
  imdbId?: string | null,
): PlayerSource {
  const match = availableSources(type, imdbId).find((source) => source.id === id);
  return match ?? preferredSource(type, imdbId);
}

export function embedUrl(source: PlayerSource, input: PlayerRequestInput): string {
  return source.buildUrl(playerRequest(input));
}
