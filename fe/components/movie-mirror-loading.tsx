"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layouts/layout";

export default function MovieMirrorLoading() {
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" /> {/* Mirror Label */}
              <Skeleton className="h-8 w-64 md:w-80" /> {/* Title */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-full" /> {/* Rating */}
                <Skeleton className="h-6 w-24 rounded-full" /> {/* Runtime */}
              </div>
            </div>

            {/* Back button */}
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>

          {/* PLAYER + META */}
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Player */}
            <div className="aspect-video w-full rounded-xl border border-border/60 overflow-hidden bg-black/70">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>

            {/* RIGHT-SIDE META */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" /> {/* Now Playing */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[95%]" />
                <Skeleton className="h-3 w-[85%]" />
                <Skeleton className="h-3 w-[70%]" />
              </div>
              <Skeleton className="h-3 w-36" /> {/* Genres */}
              <Skeleton className="h-3 w-48" /> {/* Countries */}
            </div>
          </div>

          <Separator />

          {/* RECOMMENDATIONS */}
          <section className="pb-8">
            <Skeleton className="h-6 w-56 mb-4" />

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full h-[180px] rounded-md" />
                  <Skeleton className="h-3 w-[80%]" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
