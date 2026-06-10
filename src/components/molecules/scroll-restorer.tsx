"use client";

import { useLayoutEffect } from "react";

const KEY = "__locale_section";
const SECTIONS = ["inicio", "fractae", "features", "beneficios", "planes", "faq", "contacto"];

export function saveActiveSection() {
  let closest = "inicio";
  let closestDist = Infinity;
  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const dist = Math.abs(el.getBoundingClientRect().top);
    if (dist < closestDist) {
      closestDist = dist;
      closest = id;
    }
  }
  sessionStorage.setItem(KEY, closest);
}

export function ScrollRestorer() {
  useLayoutEffect(() => {
    const id = sessionStorage.getItem(KEY);
    if (!id) return;
    sessionStorage.removeItem(KEY);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, []);
  return null;
}
