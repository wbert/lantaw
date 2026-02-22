"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/14 text-primary">
              {mediaType === "movie" ? (
                <Film className="h-4 w-4" />
              ) : (
                <Tv className="h-4 w-4" />
              )}
            </span>
            <h2 className="font-display text-3xl leading-none md:text-4xl">{title}</h2>
          </div>
          <Badge
            variant="outline"
            className="hidden rounded-full border-border/60 bg-card/65 px-3 py-1 text-[10px] uppercase tracking-[0.14em] sm:inline-flex"
          >
            {items.length} title{items.length === 1 ? "" : "s"}
          </Badge>
        </header>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => {
          const imgSrc = item.poster_path
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
              className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full overflow-hidden rounded-xl border-border/60 bg-card/65 p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-[0_25px_38px_-28px_rgba(0,0,0,0.9)]">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={imgSrc}
                    alt={displayTitle}
                    fill
                    sizes="(min-width: 1024px) 15vw, (min-width: 768px) 24vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIi8+"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-90" />

                  <div className="absolute right-2 top-2 flex gap-1">
                    {rating && (
                      <Badge className="rounded-full bg-black/65 px-2 py-0.5 text-[10px] text-white">
                        <Star className="h-3 w-3 fill-current" />
                        {rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-white/28 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white"
                    >
                      {mediaType === "movie" ? "Movie" : "Series"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/85">
                      <Calendar className="h-3 w-3" />
                      {year}
                    </span>
                  </div>
                </div>

                <CardContent className="space-y-1.5 px-3 pb-3 pt-2">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight tracking-wide group-hover:text-primary transition-colors">
                    {displayTitle}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
                    Explore details
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card className="rounded-2xl border-border/60 bg-card/65 p-10 text-center">
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
