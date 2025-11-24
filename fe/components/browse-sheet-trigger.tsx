"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function BrowseSheetTrigger() {
  const router = useRouter();

  // Sheet open state
  const [open, setOpen] = useState(false);

  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [genre, setGenre] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (mediaType) params.set("mediaType", mediaType);
    if (genre) params.set("genre", genre);
    if (language) params.set("language", language);

    router.push(`/browse${params.toString() ? `?${params}` : ""}`);

    // Close the sheet after navigating
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="px-2 py-1 text-sm">Browse</button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle>Browse</SheetTitle>
          <SheetDescription>
            Filter by media type, genre, and language.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-6">
          {/* MEDIA TYPE */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Media Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Movies", value: "movie" },
                { label: "TV Shows", value: "tv" },
              ].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={mediaType === item.value ? "default" : "outline"}
                  className="h-8 px-2 text-xs min-w-0"
                  onClick={() => setMediaType(item.value as "movie" | "tv")}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* GENRE */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Genre
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: "", label: "Any" },
                { id: "28", label: "Action" },
                { id: "35", label: "Comedy" },
                { id: "18", label: "Drama" },
                { id: "10749", label: "Romance" },
                { id: "27", label: "Horror" },
                { id: "16", label: "Animation" },
              ].map((g) => (
                <Button
                  key={g.id}
                  type="button"
                  variant={genre === g.id ? "default" : "outline"}
                  className="h-8 px-2 text-xs min-w-0 truncate"
                  onClick={() => setGenre(g.id)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </div>

          {/* LANGUAGE */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Language
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: "", label: "Any" },
                { id: "en", label: "English" },
                { id: "ko", label: "Korean" },
                { id: "ja", label: "Japanese" },
                { id: "tl", label: "Filipino" },
                { id: "es", label: "Spanish" },
              ].map((l) => (
                <Button
                  key={l.id}
                  type="button"
                  variant={language === l.id ? "default" : "outline"}
                  className="h-8 px-2 text-xs min-w-0 truncate"
                  onClick={() => setLanguage(l.id)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-3 text-xs"
              onClick={() => {
                setMediaType("movie");
                setGenre("");
                setLanguage("");
              }}
            >
              Reset
            </Button>
            <Button type="submit" className="h-8 px-3 text-xs">
              Browse
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
