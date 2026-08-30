//@ts-nocheck
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchBar } from "../search-bar";
import { ThemeToggle } from "../theme-toggle";
import { BrowseSheetTrigger } from "@/components/browse-sheet-trigger";
import { ChevronLeft } from "lucide-react";

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
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-[var(--z-sticky)] px-3 pt-3 md:px-4 md:pt-4">
        <div className="page-shell">
          <div className="surface-panel px-3 py-3 md:px-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="group flex shrink-0 items-center gap-2.5 rounded-lg px-1 py-1 transition-opacity duration-200 ease-[var(--ease-out)] hover:opacity-90"
                aria-label="Lantaw home"
              >
                <Image
                  src="/logo.svg"
                  alt="Lantaw"
                  width={34}
                  height={34}
                  className="rounded-full bg-[color:var(--color-mark-ground)] p-1 ring-1 ring-border"
                />
                <div>
                  <p className="wordmark text-2xl leading-none">Lantaw</p>
                  <p className="control-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Stream Index
                  </p>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="nav-link rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-[background-color,color] duration-200 ease-[var(--ease-out)] hover:bg-accent hover:text-foreground aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto hidden w-[clamp(18rem,30vw,26rem)] xl:block">
                <SearchBar placeholder="Find movies or series..." />
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-1">
                <div className="hidden md:block">
                  <BrowseSheetTrigger />
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-3 xl:hidden">
              <SearchBar placeholder="Find movies or series..." />
            </div>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="nav-link inline-flex min-h-11 items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <BrowseSheetTrigger />
            </div>
          </div>
        </div>
      </header>

      {(title || backHref || actions || subtitle) && (
        <section className="page-shell mt-4 md:mt-5">
          <div className="surface-panel px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                {backHref && (
                  <Link
                    href={backHref}
                    className="nav-link inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 ease-[var(--ease-out)] hover:text-foreground"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {backLabel}
                  </Link>
                )}

                {title && (
                  <h1 className="font-display text-3xl leading-none md:text-4xl">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="max-w-3xl text-sm text-muted-foreground">
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

      <footer className="statement-footer">
        <div className="statement-footer__inner">
          <p className="statement-footer__line">Find the title. Keep the night moving.</p>
          <div className="statement-footer__meta">
            <div>
              <p className="wordmark text-2xl leading-none text-foreground">Lantaw</p>
              <p>Powered by TMDB data. Not affiliated with TMDB.</p>
            </div>
            <nav className="flex flex-wrap gap-3" aria-label="Footer">
              <Link className="footer-link hover:text-foreground" href="/movies">
                Movies
              </Link>
              <Link className="footer-link hover:text-foreground" href="/series">
                Series
              </Link>
              <Link className="footer-link hover:text-foreground" href="/browse?mediaType=movie">
                Browse
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
