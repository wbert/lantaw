// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";

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
      title="Series"
      subtitle={`Page ${data.page} of ${data.total_pages} · ${data.total_results.toLocaleString()} total series`}
    >
      <div className="page-shell mt-4 space-y-5 md:mt-5">
        <section className="content-rail">
          <MediaGrid
            items={data.results}
            mediaType="tv"
            title="Popular series"
          />
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
