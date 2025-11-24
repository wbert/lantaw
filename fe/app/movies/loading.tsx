// fe/app/movies/loading.tsx
// @ts-nocheck

import { Layout } from "@/components/layouts/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function SkeletonGrid() {
  return (
    <section className="w-full space-y-3">
      <h2 className="text-sm md:text-base font-semibold text-muted-foreground">
        Trending Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
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
    <Layout title="Trending Movies" subtitle="Loading popular titles…">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-10">
        {/* Title skeleton / intro */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>

        {/* Movies grid skeleton */}
        <SkeletonGrid />

        {/* Pagination skeleton */}
        <div className="pt-4">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
