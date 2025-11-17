// app/tv/[id]/play/[mirror]/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function TVMirrorLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" /> {/* Mirror label */}
            <Skeleton className="h-8 w-64 md:w-80" /> {/* TV title */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-44 rounded-md" /> {/* Back button */}
        </div>

        {/* MIRROR SWITCHER */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-3 w-20" /> {/* label */}
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-3 w-28" /> {/* note */}
        </div>

        {/* PLAYER */}
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/60 bg-black/70">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>

        {/* META / OVERVIEW */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="space-y-2 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
          <Skeleton className="h-3 w-56" /> {/* trailer */}
        </section>

        <Separator />

        {/* SEASON + EPISODE PICKER */}
        <section className="space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" /> {/* Select season... */}
              <Skeleton className="h-3 w-40" /> {/* Season info */}
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Episodes */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-14 rounded-md" />
            ))}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="pb-8">
          <Skeleton className="h-6 w-56 mb-4" />
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
    </div>
  );
}
