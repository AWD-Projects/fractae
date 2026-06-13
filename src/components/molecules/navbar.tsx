"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveActiveSection } from "@/components/molecules/scroll-restorer";

const NAV_ITEMS = [
  { key: "inicio",      href: "#inicio" },
  { key: "fractae",     href: "#fractae" },
  { key: "features",    href: "#features" },
  { key: "beneficios",  href: "#beneficios" },
  { key: "planes",      href: "#planes" },
  { key: "faq",         href: "#faq" },
  { key: "contacto",    href: "#contacto" },
] as const;

const LOCALES = ["es", "en", "fr"] as const;

function LocaleSwitcher({ onSwitch }: { onSwitch?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: string) => {
    saveActiveSection();
    const segments = pathname.split("/");
    segments[1] = next;
    startTransition(() => router.push(segments.join("/")));
    onSwitch?.();
  };

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => switchLocale(l)}
            disabled={isPending}
            className={cn(
              "text-[12px] font-medium uppercase tracking-wide px-1 py-0.5 rounded transition-colors",
              l === locale
                ? "text-navy font-bold"
                : "text-navy/40 hover:text-navy/70"
            )}
          >
            {l}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-navy/20 text-[11px] select-none">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );
    NAV_ITEMS.forEach(({ key }) => {
      const el = document.getElementById(key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const snapTo = (id: string) => {
    (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.(id);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full bg-background",
          "px-5 sm:px-10 py-3",
          "border-b border-black/[0.06]",
          "transition-shadow duration-200",
          scrolled && "shadow-card"
        )}
      >
        <nav className="flex items-center justify-between max-w-[1280px] mx-auto">
          <Logo width={140} />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map(({ key, href }) => (
              <NavLink
                key={key}
                href={href}
                active={activeId === key}
                onClick={(e) => {
                  e.preventDefault();
                  snapTo(key);
                }}
              >
                {t(key)}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LocaleSwitcher />
            <Button
              variant="primary"
              size="md"
              style={{ width: 172 }}
              onClick={() => snapTo("contacto")}
            >
              {t("cta")}
            </Button>
          </div>

          {/* Mobile hamburger / close */}
          <button
            className="lg:hidden p-2 text-navy"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6l-12 12" stroke="#062244" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#062244" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-background pt-[57px] flex flex-col lg:hidden"
          >
            <nav className="flex flex-col flex-1 px-5 py-8 gap-1 overflow-y-auto">
              {NAV_ITEMS.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => snapTo(key)}
                  className={cn(
                    "text-left text-[18px] font-medium py-3 border-b border-black/[0.06] transition-colors",
                    activeId === key ? "text-navy" : "text-navy/50"
                  )}
                >
                  {t(key)}
                </button>
              ))}

              <div className="mt-8 flex flex-col gap-4">
                <LocaleSwitcher onSwitch={() => setMobileOpen(false)} />
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => snapTo("contacto")}
                >
                  {t("cta")}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
