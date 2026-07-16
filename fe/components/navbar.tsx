"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] px-3 pt-3 md:px-4 md:pt-4">
      <div className="page-shell">
        <div className="surface-panel flex items-center gap-3 px-3 py-3 md:px-4">
          <Link href="/" className="wordmark shrink-0 rounded-lg px-1 py-1 text-2xl leading-none">
            Lantaw
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="w-full max-w-xl">
              <SearchBar placeholder="Find movies or series..." />
            </div>
          </div>

          <nav className="ml-auto hidden items-center justify-end gap-2 text-sm md:flex">
            <Link
              href="/movies"
              className="nav-link rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Movies
            </Link>
            <Link
              href="/series"
              className="nav-link rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Series
            </Link>
          </nav>
          <ThemeToggle />
        </div>

        <div className="mt-3 md:hidden">
          <SearchBar placeholder="Find movies or series..." />
        </div>
      </div>
    </header>
  );
}
