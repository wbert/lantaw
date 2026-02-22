// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

type TVResponse = {
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

export default async function TVHome({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const data = await api<TVResponse>(
    `/v1/discover?type=tv&sort_by=popularity.desc&page=${page}`,
  );

  const makePageHref = (pageNum: number) => `/series?page=${pageNum}`;

  return (
    <Layout
      title="Series Channels"
      subtitle={`Page ${data.page} of ${data.total_pages} · ${data.total_results.toLocaleString()} total series`}
    >
      <div className="mx-auto mt-4 max-w-7xl space-y-5 px-3 md:mt-5 md:px-4">
        <section className="cinema-panel rounded-2xl p-4 md:p-6">
          <MediaGrid
            items={data.results}
            mediaType="tv"
            title="Binge Queue"
          />
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
