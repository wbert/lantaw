// app/browse/page.tsx
// @ts-nocheck
import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  // Build filters for backend
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
  const label = mediaType === "movie" ? "Movies" : "TV Shows";

  const makePageHref = (targetPage: number) => {
    const sp = new URLSearchParams();
    sp.set("mediaType", mediaType);
    if (genre) sp.set("genre", genre);
    if (language) sp.set("language", language);
    sp.set("page", String(targetPage));
    return `/browse?${sp.toString()}`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header / filters summary */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Browse {label}</h1>

          <p className="text-sm text-muted-foreground">
            {genreName && <span className="mr-2">Genre: {genreName}</span>}
            {language && <span>Language: {language.toUpperCase()}</span>}
            {!genreName && !language && "Showing popular titles."}
          </p>
        </div>

        {/* Grid */}
        <MediaGrid items={items} mediaType={mediaType} />

        {/* Pagination */}
        {data.total_pages > 1 && (
          <div className="pt-4">
            <Separator className="mb-4" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {/* Previous */}
              {page > 1 ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={makePageHref(page - 1)}>← Previous</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50"
                >
                  ← Previous
                </Button>
              )}

              <span>
                Page {data.page} of {data.total_pages}
              </span>

              {/* Next */}
              {page < data.total_pages ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={makePageHref(page + 1)}>Next →</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50"
                >
                  Next →
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
