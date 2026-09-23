"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Route transition finished
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links to show instant top progress bar
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.target &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(target.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 animate-nav-progress shadow-sm shadow-purple-500/50" />
    </div>
  );
}
