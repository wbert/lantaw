import { FormEvent, useEffect, useState, Suspense } from "react";
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

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    setValue(q);
  }, [searchParams]);

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
        "group relative flex w-full items-center rounded-full border border-border/65 bg-card/75 p-1 shadow-[0_18px_35px_-28px_rgba(0,0,0,0.8)] backdrop-blur",
        className,
      )}
    >
      <SearchIcon className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-9 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
      >
        Search
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
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>
      }
    >
      <SearchBarContent {...props} />
    </Suspense>
  );
}
