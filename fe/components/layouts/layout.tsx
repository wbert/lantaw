//@ts-nocheck
"use client";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "../search-bar";
import { ThemeToggle } from "../theme-toggle";
import { BrowseSheetTrigger } from "@/components/browse-sheet-trigger";

type PageLayoutProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Layout({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  actions,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ---------------------- HEADER ---------------------- */}
      <header className="w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* LEFT — LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition"
          >
            <Image
              src="/logo.svg"
              alt="Lantaw"
              width={40}
              height={40}
              className="invert dark:invert-0"
            />
            <span className="hidden sm:inline">Lantaw</span>
          </Link>

          {/* CENTER — SEARCH BAR (fills remaining space) */}
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* RIGHT — NAV + THEME */}
          <nav className="flex items-center gap-4 text-sm">
            {/* Hide nav links on small screens, keep theme toggle */}
            <Link
              href="/movies"
              className="hidden md:inline-block hover:text-primary transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/series"
              className="hidden md:inline-block hover:text-primary transition-colors"
            >
              TV Shows
            </Link>

            {/* BROWSE SHEET (genre/language filters) */}
            <div className="hidden md:inline-block">
              <BrowseSheetTrigger />
            </div>

            {/* On mobile you can later turn this into a full-screen sheet if you want */}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* ---------------------- PAGE TITLE ROW ---------------------- */}
      {(title || backHref || actions || subtitle) && (
        <section className="max-w-7xl mx-auto w-full px-4 pt-6 pb-4 border-b space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              {backHref && (
                <Link
                  href={backHref}
                  className="text-xs text-muted-foreground hover:text-primary transition"
                >
                  ← {backLabel}
                </Link>
              )}

              {title && (
                <h1 className="text-xl md:text-2xl font-semibold leading-tight">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </section>
      )}

      {/* ---------------------- MAIN CONTENT ---------------------- */}
      <main className="flex-1 w-full">{children}</main>

      {/* ---------------------- FOOTER ---------------------- */}
      <footer className="border-t py-6 text-center text-muted-foreground text-xs">
        <div className="max-w-7xl mx-auto">
          <p>Built with ❤️ | Lantaw</p>
          <p className="mt-1 opacity-70">
            This site uses TMDB but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
