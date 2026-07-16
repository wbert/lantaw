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
      className={cn(
        "group relative flex h-11 w-full min-w-0 items-center rounded-full border border-border bg-card/85 p-1 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <SearchIcon className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies and series"
        className="h-9 min-w-0 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
      />
      <span className="mr-1 hidden shrink-0 items-center gap-0.5 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
        <kbd className="font-sans">Ctrl</kbd>
        <kbd className="font-sans">K</kbd>
      </span>
      <Button
        type="submit"
        size="icon-sm"
        className="rounded-full"
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
        <form className={cn("relative flex items-center w-full", props.className)}>
          <Input
            type="search"
            placeholder={props.placeholder}
            className="w-full rounded-full pr-24 text-sm"
            disabled
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full px-4"
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
