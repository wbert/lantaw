// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { api } from "@/lib/api";
import { Layout } from "@/components/layouts/layout";
import MediaGrid from "@/components/media-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RawSearchItem = {
  id: number;
  media_type: "movie" | "tv" | string;
  title?: string | null;
  name?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  vote_average?: number | null;
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
      <Layout title="Search Library" subtitle="Type a title in the top search bar to begin.">
        <div className="mx-auto mt-4 max-w-7xl px-3 md:mt-5 md:px-4">
          <section className="cinema-panel rounded-2xl p-5 md:p-6">
            <p className="text-sm text-muted-foreground">
              Search across movies and TV shows, then jump directly into details and mirrors.
            </p>
          </section>
        </div>
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
      title={`Search: ${q}`}
      subtitle={`Page ${data.page} of ${data.total_pages} · ${data.total_results.toLocaleString()} total results`}
    >
      <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
              Query
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-border/60 bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
            >
              {q}
            </Badge>
          </div>

          {!hasResults && (
            <Alert className="border-border/60 bg-card/65">
              <AlertTitle className="font-display text-2xl leading-none">No direct matches</AlertTitle>
              <AlertDescription>
                Try another title, shorter query, or search by the franchise name.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            {movies.length > 0 && (
              <MediaGrid
                items={movies}
                mediaType="movie"
                title="Movies"
                className="pt-1"
              />
            )}

            {tvShows.length > 0 && (
              <MediaGrid
                items={tvShows}
                mediaType="tv"
                title="Series"
                className="pt-1"
              />
            )}
          </div>
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
