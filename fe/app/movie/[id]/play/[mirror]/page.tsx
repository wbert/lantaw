import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const movieMirrorBase: Record<string, (id: string) => string> = {
  "mirror-1": (id) => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
  "mirror-2": (id) => `https://vidlink.pro/movie/${id}`,
  "mirror-3": (id) => `https://vidsrc.to/embed/movie/${id}`,
};

const mirrorLabels: Record<string, string> = {
  "mirror-1": "Mirror 1",
  "mirror-2": "Mirror 2",
  "mirror-3": "Mirror 3",
};

const mirrorKeys = ["mirror-1", "mirror-2", "mirror-3"];

export default async function MovieMirrorPage({ params }: PageProps) {
  const { id, mirror } = await params;

  const data = await api<MovieApiResponse>(`/v1/media/movie/${id}`);
  const { details, recommendations } = data;

  const buildUrl = movieMirrorBase[mirror] ?? movieMirrorBase["mirror-1"];
  const embedUrl = buildUrl(id);
  const mirrorLabel = mirrorLabels[mirror] ?? "Mirror 1";

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
      <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
              {mirrorLabel}
            </Badge>
            {year && (
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                {year}
              </Badge>
            )}
            {rating && (
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                ⭐ {rating}
              </Badge>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {mirrorKeys.map((mirrorKey) => (
              <Button
                key={mirrorKey}
                asChild
                size="sm"
                variant={mirrorKey === mirror ? "default" : "outline"}
                className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
              >
                <Link href={`/movie/${id}/play/${mirrorKey}`}>{mirrorLabels[mirrorKey]}</Link>
              </Button>
            ))}
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black">
            <iframe
              src={embedUrl}
              title={details?.title}
              className="h-full w-full"
              referrerPolicy="origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <p className="leading-relaxed">{details?.overview}</p>
            <div className="space-y-2 rounded-xl border border-border/60 bg-card/55 p-3 text-xs">
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
          <section className="cinema-panel rounded-2xl p-4 md:p-6">
            <MediaGrid
              items={recommendations.results}
              mediaType="movie"
              title="Watch Next"
            />
          </section>
        )}
      </div>
    </Layout>
  );
}
