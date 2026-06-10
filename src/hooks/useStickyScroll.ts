"use client";

import { useState, useEffect } from "react";

export function useStickyScroll(
  refs: React.RefObject<HTMLElement>[],
  options?: { threshold?: number; rootMargin?: string }
): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const threshold = options?.threshold ?? 0.5;
    const rootMargin = options?.rootMargin ?? "-20% 0px -20% 0px";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.findIndex(
              (ref) => ref.current === entry.target
            );
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold, rootMargin }
    );

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [refs, options?.threshold, options?.rootMargin]);

  return activeIndex;
}
