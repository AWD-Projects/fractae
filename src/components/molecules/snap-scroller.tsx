"use client";

import { useEffect } from "react";

export function SmoothScrollInit() {
  useEffect(() => {
    (window as unknown as { __snapTo?: (id: string) => void }).__snapTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }, []);
  return null;
}
