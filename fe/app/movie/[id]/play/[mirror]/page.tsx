import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layouts/layout";
import { availableSources, embedUrl, resolveSource } from "@/lib/player-sources";

type MovieApiResponse = {
  details: any;
  credits: any;
  videos: any;
  recommendations: { results: any[] };
};

type PageProps = {
  params: Promise<{ id: string; mirror: string }>;
};

export const revalidate = 60;

export default async function MovieMirrorPage({ params }: PageProps) {
  const { id, mirror } = await params;

  const data = await api<MovieApiResponse>(`/v1/media/movie/${id}`);
  const { details, recommendations } = data;

  const imdbId: string | null = details?.imdb_id ?? details?.external_ids?.imdb_id ?? null;
  const mirrors = availableSources("movie", imdbId);
  const activeMirror = resolveSource("movie", mirror, imdbId);
  const embedSrc = embedUrl(activeMirror, { mediaId: id, imdbId });
  const mirrorLabel = activeMirror.label;

  const year = details?.release_date?.slice(0, 4) ?? "";
  const rating =
    typeof details?.vote_average === "number"
      ? details.vote_average.toFixed(1)
      : null;

  return (
    <Layout
      title="Playback Room"
      subtitle={`${details?.title ?? "Movie"} · ${mirrorLabel}`}
      backHref={`/movie/${id}`}
    >
      <div className="page-shell mt-4 space-y-8 md:mt-5">
        <section className="content-rail">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="soft-chip">
              {mirrorLabel}
            </span>
            {year && (
              <span className="soft-chip">
                {year}
              </span>
            )}
            {rating && (
              <span className="soft-chip">{rating} / 10</span>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {mirrors.map((source) => (
              <Button
                key={source.id}
                asChild
                size="sm"
                variant={source.id === activeMirror.id ? "default" : "outline"}
                className="control-label rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                <Link href={`/movie/${id}/play/${source.id}`}>{source.label}</Link>
              </Button>
            ))}
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-panel)] border border-border bg-[color:var(--color-paper)]">
            <iframe
              src={embedSrc}
              title={details?.title}
              className="h-full w-full"
              referrerPolicy="origin"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <p className="leading-relaxed">{details?.overview}</p>
            <div className="space-y-2 rounded-[var(--radius-card)] border border-border bg-card p-3 text-xs">
              {details?.genres?.length > 0 && (
                <p>
                  <span className="font-semibold text-foreground">Genres:</span>{" "}
                  {details.genres.map((g: any) => g.name).join(" · ")}
                </p>
              )}
              {details?.production_countries?.length > 0 && (
                <p>
                  <span className="font-semibold text-foreground">Countries:</span>{" "}
                  {details.production_countries.map((c: any) => c.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {recommendations?.results?.length > 0 && (
          <section className="content-rail">
            <MediaGrid
              items={recommendations.results}
              mediaType="movie"
              title="Watch next"
            />
          </section>
        )}
      </div>
    </Layout>
  );
}
