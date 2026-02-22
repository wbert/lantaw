//@ts-nocheck
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "../search-bar";
import { ThemeToggle } from "../theme-toggle";
import { BrowseSheetTrigger } from "@/components/browse-sheet-trigger";
import { Badge } from "@/components/ui/badge";

type PageLayoutProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const NAV_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
];

export function Layout({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  actions,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-4 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <div className="cinema-panel rounded-2xl px-3 py-3 md:px-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/"
                className="group flex items-center gap-2.5 rounded-lg px-1 py-1 transition hover:opacity-90"
              >
                <Image
                  src="/logo.svg"
                  alt="Lantaw"
                  width={34}
                  height={34}
                  className="drop-shadow-[0_0_18px_rgba(255,66,45,0.45)]"
                />
                <div>
                  <p className="font-display text-2xl leading-none">Lantaw</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Stream Index
                  </p>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:bg-accent/70 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto hidden xl:block w-[360px]">
                <SearchBar placeholder="Find movies or series..." />
              </div>

              <div className="ml-auto flex items-center gap-2 xl:ml-3">
                <div className="hidden md:block">
                  <BrowseSheetTrigger />
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-3 xl:hidden">
              <SearchBar placeholder="Find movies or series..." />
            </div>

            <div className="mt-3 flex md:hidden items-center gap-2 overflow-x-auto pb-1">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Badge
                    variant="outline"
                    className="whitespace-nowrap rounded-full border-border/60 bg-card/70 px-3 py-1 text-[10px] uppercase tracking-[0.15em]"
                  >
                    {item.label}
                  </Badge>
                </Link>
              ))}
              <BrowseSheetTrigger />
            </div>
          </div>
        </div>
      </header>

      {(title || backHref || actions || subtitle) && (
        <section className="mx-auto mt-4 w-full max-w-7xl px-3 md:mt-5 md:px-4">
          <div className="cinema-panel rounded-2xl px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                {backHref && (
                  <Link
                    href={backHref}
                    className="inline-flex text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
                  >
                    ← {backLabel}
                  </Link>
                )}

                {title && (
                  <h1 className="font-display text-3xl leading-none md:text-4xl">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        </section>
      )}

      <main className="w-full pb-14">{children}</main>

      <footer className="mt-auto border-t border-border/55 bg-black/25 px-4 py-6 text-center text-xs text-muted-foreground backdrop-blur">
        <div className="mx-auto max-w-7xl">
          <p className="uppercase tracking-[0.16em]">Lantaw Discovery Hub</p>
          <p className="mt-1 opacity-80">
            Powered by TMDB data. Not affiliated with TMDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
