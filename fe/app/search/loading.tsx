// fe/app/search/loading.tsx
// @ts-nocheck

import { Layout } from "@/components/layouts/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function SkeletonGrid({ title }: { title: string }) {
  return (
    <section className="w-full space-y-3">
      <h2 className="text-sm md:text-base font-semibold text-muted-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))] md:grid-cols-[repeat(5,minmax(0,1fr))] lg:grid-cols-[repeat(6,minmax(0,1fr))]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full aspect-[2/3] rounded-md" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <Layout title="Searching…" subtitle="Fetching results, please wait.">
      <div className="page-shell py-6 space-y-6">
        <div className="space-y-6">
          {/* Top message */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Movies skeleton */}
          <SkeletonGrid title="Movies" />

          {/* TV Shows skeleton */}
          <SkeletonGrid title="TV Shows" />

          {/* Pagination skeleton */}
          <div className="pt-4 mt-4">
            <Separator className="mb-4" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
