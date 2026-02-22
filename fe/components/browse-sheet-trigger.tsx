"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type BrowseSheetTriggerProps = {
  className?: string;
};

const GENRES = [
  { id: "", label: "Any" },
  { id: "28", label: "Action" },
  { id: "35", label: "Comedy" },
  { id: "18", label: "Drama" },
  { id: "10749", label: "Romance" },
  { id: "27", label: "Horror" },
  { id: "16", label: "Animation" },
];

const LANGUAGES = [
  { id: "", label: "Any" },
  { id: "en", label: "English" },
  { id: "ko", label: "Korean" },
  { id: "ja", label: "Japanese" },
  { id: "tl", label: "Filipino" },
  { id: "es", label: "Spanish" },
];

export function BrowseSheetTrigger({ className }: BrowseSheetTriggerProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [genre, setGenre] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("mediaType", mediaType);
    if (genre) params.set("genre", genre);
    if (language) params.set("language", language);

    router.push(`/browse?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full border-border/60 bg-card/70 px-3 text-xs uppercase tracking-[0.14em] hover:bg-accent/70 ${className ?? ""}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Browse
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full border-l-border/55 bg-background/95 px-5 pt-6 sm:max-w-md">
        <SheetHeader className="mb-6 space-y-1">
          <SheetTitle className="font-display text-3xl leading-none">Smart Browse</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Mix format, genre, and language filters to discover what to watch next.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Format
            </label>
            <div className="flex flex-wrap gap-2">
              {[{ label: "Movies", value: "movie" }, { label: "Series", value: "tv" }].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={mediaType === item.value ? "default" : "outline"}
                  className="h-8 rounded-full px-3 text-xs"
                  onClick={() => setMediaType(item.value as "movie" | "tv")}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Genre
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENRES.map((g) => (
                <Button
                  key={g.id || "any-genre"}
                  type="button"
                  variant={genre === g.id ? "default" : "outline"}
                  className="h-8 justify-start rounded-full px-3 text-xs"
                  onClick={() => setGenre(g.id)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Language
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LANGUAGES.map((l) => (
                <Button
                  key={l.id || "any-lang"}
                  type="button"
                  variant={language === l.id ? "default" : "outline"}
                  className="h-8 justify-start rounded-full px-3 text-xs"
                  onClick={() => setLanguage(l.id)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-full px-4 text-xs"
              onClick={() => {
                setMediaType("movie");
                setGenre("");
                setLanguage("");
              }}
            >
              Reset
            </Button>
            <Button type="submit" className="h-8 rounded-full px-4 text-xs">
              Apply Filters
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
