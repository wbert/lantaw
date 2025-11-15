"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useRouteLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // whenever URL changes → show loader
    setLoading(true);

    // hide loader after render settles
    const t = setTimeout(() => setLoading(false), 300);

    return () => clearTimeout(t);
  }, [pathname]);

  return loading;
}
