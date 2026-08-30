"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Tv, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

interface MediaGridProps {
  items: MediaItem[];
  mediaType: "movie" | "tv";
  title?: string;
  className?: string;
  isLoading?: boolean;
}

export default function MediaGrid({
  items,
  mediaType,
  title,
  className,
  isLoading = false,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <section className={cn("w-full space-y-5", className)}>
        {title && <Skeleton className="h-8 w-52" />}
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))] md:grid-cols-[repeat(4,minmax(0,1fr))] lg:grid-cols-[repeat(6,minmax(0,1fr))]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full space-y-5", className)}>
      {title && (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
              {mediaType === "movie" ? (
                <Film className="h-4 w-4" />
              ) : (
                <Tv className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-3xl leading-none md:text-4xl">{title}</h2>
              <p className="text-sm text-muted-foreground">
                {mediaType === "movie" ? "Movie feed" : "Series feed"}
              </p>
            </div>
          </div>
          <span className="soft-chip w-fit">
            {items.length} title{items.length === 1 ? "" : "s"}
          </span>
        </header>
      )}

      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))] md:grid-cols-[repeat(4,minmax(0,1fr))] lg:grid-cols-[repeat(6,minmax(0,1fr))]">
        {items.map((item) => {
          const hasPoster = Boolean(item.poster_path);
          const imgSrc = hasPoster
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : "/logo.svg";

          const displayTitle = item.title || item.name || "Untitled";
          const year =
            item.release_date?.slice(0, 4) ||
            item.first_air_date?.slice(0, 4) ||
            "TBA";
          const rating = typeof item.vote_average === "number" ? item.vote_average : null;

          return (
            <Link
              key={item.id}
              href={`/${mediaType}/${item.id}`}
              className="lift-link group block rounded-[var(--radius-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full overflow-hidden rounded-[var(--radius-card)] border-border bg-card p-0 transition-[background-color,border-color] duration-200 ease-[var(--ease-out)] group-hover:border-primary/70 group-hover:bg-accent">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={imgSrc}
                    alt={displayTitle}
                    fill
                    sizes="(min-width: 1024px) 15vw, (min-width: 768px) 24vw, 50vw"
                    className={cn(
                      "bg-[color:var(--color-mark-ground)]",
                      hasPoster ? "object-cover" : "object-contain p-8",
                    )}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIi8+"
                  />

                  <div className="poster-hero__fade" />

                  <div className="absolute right-2 top-2 flex gap-1">
                    {rating && (
                      <span className="media-chip min-h-7 px-2 py-0.5 text-[10px]">
                        <Star className="h-3 w-3 fill-current" />
                        {rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                    <span className="media-chip min-h-7 px-2 py-0.5 text-[10px]">
                      {mediaType === "movie" ? "Movie" : "Series"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-hero-ink)]">
                      <Calendar className="h-3 w-3" />
                      {year}
                    </span>
                  </div>
                </div>

                <CardContent className="space-y-1.5 px-3 pb-3 pt-2">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight tracking-wide transition-colors duration-200 ease-[var(--ease-out)] group-hover:text-primary">
                    {displayTitle}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Open details
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card className="rounded-[var(--radius-panel)] border-border bg-card p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            {mediaType === "movie" ? (
              <Film className="h-10 w-10 text-muted-foreground/70" />
            ) : (
              <Tv className="h-10 w-10 text-muted-foreground/70" />
            )}
            <div className="space-y-1">
              <h3 className="font-display text-3xl leading-none">No titles found</h3>
              <p className="text-sm text-muted-foreground">
                Try another query, genre, or language.
              </p>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
