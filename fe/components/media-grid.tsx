// fe/components/media-grid.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Tv, Calendar } from "lucide-react";
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
      <section className={cn("w-full space-y-6", className)}>
        {title && <Skeleton className="h-8 w-48" />}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full space-y-6", className)}>
      {title && (
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {mediaType === "movie" ? (
              <Film className="h-6 w-6 text-primary" />
            ) : (
              <Tv className="h-6 w-6 text-primary" />
            )}
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </header>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const imgSrc = item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : "/no-poster.png";
          const displayTitle = item.title || item.name || "Untitled";
          const year =
            item.release_date?.slice(0, 4) ||
            item.first_air_date?.slice(0, 4) ||
            "";
          const rating = item.vote_average
            ? (item.vote_average / 10) * 100
            : null;

          return (
            <Link
              key={item.id}
              href={`/${mediaType}/${item.id}`}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
            >
              <Card className="pt-0 h-full overflow-hidden border-border/60 bg-card/90 backdrop-blur-sm transition-all duration-200 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/5 flex flex-col">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={imgSrc}
                    alt={displayTitle}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 20vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                  />
                  {rating && (
                    <Badge
                      variant={rating >= 70 ? "default" : "secondary"}
                      className="absolute top-2 right-2 text-xs font-semibold shadow-md"
                    >
                      {Math.round(rating)}%
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>

                <CardContent className="px-2.5 space-y-1">
                  <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {displayTitle}
                  </h3>
                  {year && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{year}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            {mediaType === "movie" ? (
              <Film className="h-12 w-12 text-muted-foreground/50" />
            ) : (
              <Tv className="h-12 w-12 text-muted-foreground/50" />
            )}
            <div className="space-y-1">
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
