// fe/app/movies/page.tsx
// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

type MovieResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function MoviesHome({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? "1") || 1;

  const data = await api<MovieResponse>(
    `/v1/discover?type=movie&sort_by=popularity.desc&page=${page}`,
  );

  const makePageHref = (pageNumber: number) => `/movies?page=${pageNumber}`;

  return (
    <Layout title="Trending Movies" subtitle={`Page ${data.page}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-10">
        {/* Movie Grid */}
        <MediaGrid
          items={data.results}
          mediaType="movie"
          title="Trending Movies"
        />

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

              {/* Page Info */}
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
