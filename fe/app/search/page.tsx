// fe/app/search/page.tsx
// @ts-nocheck
import Link from "next/link";
import { api } from "@/lib/api";
import { Layout } from "@/components/layouts/layout";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RawSearchItem = {
  id: number;
  media_type: "movie" | "tv" | string;
  title?: string | null;
  name?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
};

type SearchResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: RawSearchItem[];
};

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export const revalidate = 60;

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Number(params.page ?? "1") || 1;

  if (!q) {
    return (
      <Layout title="Search">
        <p className="text-sm text-muted-foreground">
          Use the search bar above to find movies and TV shows.
        </p>
      </Layout>
    );
  }

  const data = await api<SearchResponse>(
    `/v1/search?q=${encodeURIComponent(q)}&page=${page}`,
  );

  const movies = data.results.filter((r) => r.media_type === "movie");
  const tvShows = data.results.filter((r) => r.media_type === "tv");
  const hasResults = movies.length > 0 || tvShows.length > 0;

  const makePageHref = (targetPage: number) =>
    `/search?q=${encodeURIComponent(q)}&page=${targetPage}`;

  return (
    <Layout
      title={`Results for "${q}"`}
      subtitle={`Page ${data.page} · ${data.total_results} total result${
        data.total_results === 1 ? "" : "s"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6">
        <div className="space-y-8">
          {/* Empty state */}
          {!hasResults && (
            <Alert>
              <AlertTitle>No results found</AlertTitle>
              <AlertDescription>
                Try searching for another movie or TV show title.
              </AlertDescription>
            </Alert>
          )}

          {/* Movies */}
          {movies.length > 0 && (
            <MediaGrid
              items={movies}
              mediaType="movie"
              title="Movies"
              className="pt-0"
            />
          )}

          {/* TV Shows */}
          {tvShows.length > 0 && (
            <MediaGrid
              items={tvShows}
              mediaType="tv"
              title="TV Shows"
              className="pt-0"
            />
          )}

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="pt-4 mt-4">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                  Page {page} of {data.total_pages}
                </span>

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
      </div>
    </Layout>
  );
}
