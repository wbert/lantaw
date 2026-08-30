// @ts-nocheck
import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";

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
      title="Browse filters"
      subtitle={`Page ${data.page} of ${data.total_pages} · ${data.total_results.toLocaleString()} matches`}
    >
      <div className="page-shell mt-4 space-y-5 md:mt-5">
        <section className="content-rail">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="soft-chip">
              {label}
            </span>
            {genreName && (
              <span className="soft-chip">
                Genre: {genreName}
              </span>
            )}
            {language && (
              <span className="soft-chip">
                Language: {language.toUpperCase()}
              </span>
            )}
            {!genreName && !language && (
              <span className="soft-chip">
                Popular right now
              </span>
            )}
          </div>

          <MediaGrid items={items} mediaType={mediaType} title={`${label} Collection`} />
        </section>

        {data.total_pages > 1 && (
          <section className="pagination-strip">
            <Button
              variant="outline"
              size="sm"
              asChild={page > 1}
              disabled={page <= 1}
              className="control-label rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]"
            >
              {page > 1 ? (
                <Link href={makePageHref(page - 1)}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>

            <span className="soft-chip justify-center">
              Page {data.page} / {data.total_pages}
            </span>

            <Button
              variant="outline"
              size="sm"
              asChild={page < data.total_pages}
              disabled={page >= data.total_pages}
              className="control-label rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]"
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
