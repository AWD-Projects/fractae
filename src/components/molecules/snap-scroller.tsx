"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

const SECTION_IDS = [
  "inicio", "fractae", "features", "beneficios", "planes", "faq", "contacto",
];
const ANIM_DURATION = 650; // ms per section transition

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function SnapScroller({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIdxRef = useRef(0);
  const lockedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const animateTo = useCallback((targetIdx: number) => {
    const el = containerRef.current;
    if (!el || lockedRef.current) return;
    if (targetIdx < 0 || targetIdx >= SECTION_IDS.length) return;

    lockedRef.current = true;
    currentIdxRef.current = targetIdx;

    const from = el.scrollTop;
    const to = targetIdx * el.clientHeight;
    const startTime = performance.now();

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIM_DURATION, 1);
      el.scrollTop = from + (to - from) * easeInOutCubic(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.scrollTop = to;
        rafRef.current = null;
        lockedRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  // Also expose animateTo so nav links can call it
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__snapTo = (id: string) => {
      const idx = SECTION_IDS.indexOf(id);
      if (idx !== -1) animateTo(idx);
    };
  }, [animateTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Sync currentIdx on manual scroll (e.g. scrollRestorer)
    const onScroll = () => {
      if (lockedRef.current) return;
      currentIdxRef.current = Math.round(el.scrollTop / el.clientHeight);
    };

    // Wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockedRef.current) return;
      if (Math.abs(e.deltaY) < 10) return;
      animateTo(currentIdxRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    // Touch
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (lockedRef.current) return;
      const delta = touchY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      animateTo(currentIdxRef.current + (delta > 0 ? 1 : -1));
    };

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        animateTo(currentIdxRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        animateTo(currentIdxRef.current - 1);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animateTo]);

  return (
    <div
      ref={containerRef}
      id="snap-root"
      className="h-screen overflow-y-scroll relative z-10"
      style={{ scrollBehavior: "auto" }}
    >
      {children}
    </div>
  );
}
