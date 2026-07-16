// app/browse/loading.tsx
// @ts-nocheck

import { Layout } from "@/components/layouts/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function SkeletonGrid() {
  return (
    <section className="w-full space-y-3">
      <h2 className="text-sm md:text-base font-semibold text-muted-foreground">
        Browse Results
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
    <Layout title="Browse" subtitle="Loading filtered titles…">
      <div className="page-shell py-6 space-y-8">
        {/* Header / filters summary skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Grid skeleton */}
        <SkeletonGrid />

        {/* Pagination skeleton */}
        <div className="pt-4">
          <Separator className="mb-4" />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
