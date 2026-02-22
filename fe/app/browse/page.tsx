// @ts-nocheck
import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BrowseSearchParams = {
  mediaType?: "movie" | "tv";
  genre?: string;
  language?: string;
  page?: string;
};

type BrowsePageProps = {
  searchParams: Promise<BrowseSearchParams>;
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

type DiscoverResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
};

const GENRE_MAP: Record<string, string> = {
  "28": "Action",
  "35": "Comedy",
  "18": "Drama",
  "10749": "Romance",
  "27": "Horror",
  "16": "Animation",
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;

  const mediaType = params.mediaType || "movie";
  const genre = params.genre;
  const language = params.language;
  const page = Number(params.page ?? "1") || 1;

  const genreName = genre ? (GENRE_MAP[genre] ?? `Unknown (${genre})`) : null;

  const query: Record<string, string> = {
    type: mediaType,
    sort_by: "popularity.desc",
    page: String(page),
  };

  if (genre) query.with_genres = genre;
  if (language) query.with_original_language = language;

  const queryString = new URLSearchParams(query).toString();
  const path = `/v1/discover?${queryString}`;

  const data = await api<DiscoverResponse>(path, {
    next: { revalidate: 0 },
  });

  const items = data.results ?? [];
  const label = mediaType === "movie" ? "Movies" : "Series";

  const makePageHref = (targetPage: number) => {
    const sp = new URLSearchParams();
    sp.set("mediaType", mediaType);
    if (genre) sp.set("genre", genre);
    if (language) sp.set("language", language);
    sp.set("page", String(targetPage));
    return `/browse?${sp.toString()}`;
  };

  return (
    <Layout
      title="Smart Browse"
      subtitle={`Page ${data.page} of ${data.total_pages} · ${data.total_results.toLocaleString()} matches`}
    >
      <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
              {label}
            </Badge>
            {genreName && (
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                Genre: {genreName}
              </Badge>
            )}
            {language && (
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                Language: {language.toUpperCase()}
              </Badge>
            )}
            {!genreName && !language && (
              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
              >
                Popular right now
              </Badge>
            )}
          </div>

          <MediaGrid items={items} mediaType={mediaType} title={`${label} Collection`} />
        </section>

        {data.total_pages > 1 && (
          <section className="cinema-panel flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between md:px-6">
            <Button
              variant="outline"
              size="sm"
              asChild={page > 1}
              disabled={page <= 1}
              className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
            >
              {page > 1 ? (
                <Link href={makePageHref(page - 1)}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>

            <Badge
              variant="outline"
              className="justify-center rounded-full border-border/60 bg-card/60 px-4 py-1 text-[10px] uppercase tracking-[0.15em]"
            >
              Page {data.page} / {data.total_pages}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              asChild={page < data.total_pages}
              disabled={page >= data.total_pages}
              className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
            >
              {page < data.total_pages ? (
                <Link href={makePageHref(page + 1)}>Next</Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </section>
        )}
      </div>
    </Layout>
  );
}
