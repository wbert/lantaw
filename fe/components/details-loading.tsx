// app/movie/[id]/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function MovieDetailsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SKELETON */}
      <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/10" />

        {/* Content */}
        <div className="relative h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-6 md:gap-10">
          {/* Poster skeleton (desktop) */}
          <div className="hidden md:block flex-shrink-0">
            <div className="relative w-[220px] aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-border/60">
              <Skeleton className="h-full w-full rounded-2xl" />
            </div>
          </div>

          {/* Text skeletons */}
          <div className="flex-1 space-y-4 md:space-y-5">
            <div className="space-y-3">
              {/* Title + year */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 md:w-2/3" />
                <Skeleton className="h-4 w-24 md:w-28" />
              </div>

              {/* Rating / genres / runtime chips */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2 max-w-2xl">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>

            {/* Countries row */}
            <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">
              <Skeleton className="h-4 w-48" />
            </div>

            <Separator className="my-2 opacity-60" />

            {/* Mirrors + trailer buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE POSTER SKELETON */}
      <section className="md:hidden max-w-6xl mx-auto px-4 md:px-6 mt-4">
        <div className="flex justify-center">
          <div className="relative w-[180px] aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-border/60">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* CAST SKELETON */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6">
        <Skeleton className="h-6 w-32" />

        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex-shrink-0 w-28 text-center space-y-2">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDATIONS SKELETON */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <Skeleton className="h-6 w-48 mb-4" />

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="w-full h-[180px] rounded-md overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-3 w-[80%]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
