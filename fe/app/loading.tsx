"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layouts/layout";

export default function Loading() {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="poster-hero page-shell h-[220px] md:h-[280px]">
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />

          <div className="relative h-full flex items-center md:items-end">
            <div className="p-5 md:p-8 max-w-xl space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-64 md:w-80" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[90%]" />
              <Skeleton className="h-3 w-[70%]" />
            </div>
          </div>
        </section>

          <div className="page-shell py-6 space-y-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))] md:grid-cols-[repeat(4,minmax(0,1fr))] lg:grid-cols-[repeat(6,minmax(0,1fr))]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full h-[180px] rounded-md" />
                <Skeleton className="h-3 w-[80%]" />
              </div>
            ))}
          </div>
        </div>

        <div className="page-shell py-6 space-y-6">
          <Skeleton className="h-6 w-56 mb-2" />
          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))] md:grid-cols-[repeat(4,minmax(0,1fr))] lg:grid-cols-[repeat(6,minmax(0,1fr))]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full h-[180px] rounded-md" />
                <Skeleton className="h-3 w-[80%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
