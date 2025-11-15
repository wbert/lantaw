// fe/lib/api.ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const isServer = typeof window === "undefined";
  const base = isServer
    ? process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE
    : process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    console.error("API_BASE_INTERNAL / NEXT_PUBLIC_API_BASE is not set");
    throw new Error("API base URL is not configured");
  }

  const url = `${base}${path}`;

  const res = await fetch(
    url,
    // allow caller to override `next` options but default revalidate=60
    {
      ...init,
      next: {
        revalidate: 60,
        ...(init as any)?.next,
      },
    },
  );

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      // ignore
    }
    console.error("API error", {
      url,
      status: res.status,
      bodyPreview: bodyText.slice(0, 300),
    });
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
