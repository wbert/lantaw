import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layouts/layout";

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

// simple config per mirror
const movieMirrorBase: Record<string, (id: string) => string> = {
  "mirror-1": (id) => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
  "mirror-2": (id) => `https://vidlink.pro/movie/${id}`,
  "mirror-3": (id) => `https://vidsrc.to/embed/movie/${id}`, // placeholder
};

const mirrorLabels: Record<string, string> = {
  "mirror-1": "Mirror 1",
  "mirror-2": "Mirror 2",
  "mirror-3": "Mirror 3",
};

export default async function MovieMirrorPage({ params }: PageProps) {
  const { id, mirror } = await params;

  const data = await api<MovieApiResponse>(`/v1/media/movie/${id}`);
  const { details, recommendations } = data;

  // pick base for this mirror – fallback to mirror-1
  const buildUrl = movieMirrorBase[mirror] ?? movieMirrorBase["mirror-1"];
  const embedUrl = buildUrl(id);
  const mirrorLabel = mirrorLabels[mirror] ?? "Mirror 1";

  const year = details?.release_date?.slice(0, 4) ?? "";
  const rating =
    typeof details?.vote_average === "number"
      ? details.vote_average.toFixed(1)
      : null;
  const votes =
    typeof details?.vote_count === "number"
      ? details.vote_count.toLocaleString()
      : null;

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {mirrorLabel} · Movie
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {details?.title}
                {year && (
                  <span className="text-muted-foreground text-lg md:text-xl ml-1.5">
                    ({year})
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {rating && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-full px-2 py-0.5"
                  >
                    <span>⭐</span>
                    <span className="font-semibold text-foreground">
                      {rating}
                    </span>
                    {votes && (
                      <span className="text-[10px]">({votes} votes)</span>
                    )}
                  </Badge>
                )}

                {details?.runtime && (
                  <Badge variant="outline" className="rounded-full px-2 py-0.5">
                    {details.runtime} min
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <Link href={`/movie/${id}`}>← Back to details</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Player */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-border/60">
              <iframe
                src={embedUrl}
                title={details?.title}
                className="w-full h-full"
                referrerPolicy="origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Now Playing
              </p>
              {details?.overview && (
                <p className="text-sm leading-relaxed line-clamp-[10]">
                  {details.overview}
                </p>
              )}
              {details?.genres && details.genres.length > 0 && (
                <p className="text-xs">
                  <span className="font-semibold text-foreground">Genres:</span>{" "}
                  {details.genres.map((g: any) => g.name).join(" · ")}
                </p>
              )}
              {details?.production_countries &&
                details.production_countries.length > 0 && (
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">
                      Countries:
                    </span>{" "}
                    {details.production_countries
                      .map((c: any) => c.name)
                      .join(", ")}
                  </p>
                )}
            </div>
          </div>

          <Separator />

          {/* RECOMMENDATIONS */}
          {recommendations?.results?.length > 0 && (
            <section className="pb-8">
              <MediaGrid
                items={recommendations.results}
                mediaType="movie"
                title="You might also like"
              />
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
