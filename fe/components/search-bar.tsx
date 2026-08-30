import { FormEvent, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

const SEARCH_FORM_CLASS =
  "group flex h-11 w-full min-w-0 items-center gap-1 rounded-full border border-border bg-card/70 p-1 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25";

function SearchBarContent({
  placeholder = "Search movies, TV shows...",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    setValue(q);
  }, [searchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (!isTyping && event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(SEARCH_FORM_CLASS, className)}
    >
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies and series"
        className="h-9 min-w-0 rounded-full border-0 bg-transparent px-3 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <kbd className="hidden shrink-0 rounded-md border border-border/80 bg-background/50 px-2 py-1 font-sans text-[10px] font-semibold text-muted-foreground sm:block">
        /
      </kbd>
      <Button
        type="submit"
        size="icon-sm"
        className="size-9 min-h-9 rounded-full"
        aria-label="Run search"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <form className={cn(SEARCH_FORM_CLASS, props.className)}>
          <Input
            type="search"
            placeholder={props.placeholder}
            className="h-9 min-w-0 rounded-full border-0 bg-transparent px-3 text-sm shadow-none dark:bg-transparent"
            disabled
          />
          <Button
            type="submit"
            size="icon-sm"
            className="size-9 min-h-9 rounded-full"
            disabled
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
      }
    >
      <SearchBarContent {...props} />
    </Suspense>
  );
}
