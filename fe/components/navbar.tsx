"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="w-full max-w-7xl mx-auto h-16 px-4 md:px-6">
        {/* 3-column balanced grid */}
        <div className="grid grid-cols-3 h-full items-center">
          {/* LEFT: Logo */}

          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                MVReels
              </span>
            </Link>
          </div>

          {/* CENTER: Fixed-width search bar (TRUE CENTER) */}
          <div className="flex justify-center text-center">
            <div className="w-full max-w-lg">
              <SearchBar />
            </div>
          </div>

          {/* RIGHT: Nav */}
          <nav className="hidden md:flex items-center justify-end gap-4 text-sm">
            <Link
              href="/movies"
              className="text-muted-foreground hover:text-foreground"
            >
              Movies
            </Link>
            <Link
              href="/series"
              className="text-muted-foreground hover:text-foreground"
            >
              TV Shows
            </Link>
          </nav>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
