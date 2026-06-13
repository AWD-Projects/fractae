"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Shield, DollarSign, MessageSquare, BarChart2, CalendarDays, Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Chip } from "@/components/ui/chip";
import { FadeIn } from "@/components/ui/fade-in";
import { funcionalidades } from "@/data/mock";
import { cn } from "@/lib/utils";
import accessImg from "@/assets/features/access.jpeg";
import financeImg from "@/assets/features/finance.jpeg";
import communicationImg from "@/assets/features/communication.jpeg";
import reportsImg from "@/assets/features/reports.jpeg";
import reservationsImg from "@/assets/features/reservations.jpeg";
import communityImg from "@/assets/features/community.jpeg";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, DollarSign, MessageSquare, BarChart2, CalendarDays, Users,
};

const FEATURE_IMAGES = [
  accessImg, financeImg, communicationImg,
  reportsImg, reservationsImg, communityImg,
];

const INTERVAL_MS = 3500;

function PhoneFrame({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const w = Math.round(276 * scale);
  const h = Math.round(576 * scale);
  return (
    <div className="relative flex-shrink-0" style={{ width: w, height: h }}>
      <div className="absolute inset-0 rounded-[40px] bg-zinc-500 shadow-[0_28px_72px_rgba(0,0,0,0.40)]" />
      <div className="absolute inset-[2px] rounded-[38px] bg-zinc-950" />
      <div className="absolute inset-[9px] rounded-[31px] bg-black overflow-hidden">
        {children}
      </div>
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[86px] h-[24px] bg-zinc-950 rounded-full z-10"
        style={{ width: Math.round(86 * scale), top: Math.round(20 * scale) }} />
      <div className="absolute right-[-2px] bg-zinc-400 rounded-r-full"
        style={{ top: Math.round(108 * scale), width: 3, height: Math.round(52 * scale) }} />
      <div className="absolute left-[-2px] bg-zinc-400 rounded-l-full"
        style={{ top: Math.round(86 * scale), width: 3, height: Math.round(29 * scale) }} />
      <div className="absolute left-[-2px] bg-zinc-400 rounded-l-full"
        style={{ top: Math.round(130 * scale), width: 3, height: Math.round(52 * scale) }} />
      <div className="absolute left-[-2px] bg-zinc-400 rounded-l-full"
        style={{ top: Math.round(196 * scale), width: 3, height: Math.round(52 * scale) }} />
    </div>
  );
}

type FeatureItem = {
  titulo: string;
  descripcion: string;
  texto: string;
  bullets: string[];
};

export function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as FeatureItem[];
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [loopKey, setLoopKey] = useState(0);
  const activeIdxRef = useRef(0);
  const fadingRef = useRef(false);

  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      if (fadingRef.current) return;
      const next = (activeIdxRef.current + 1) % items.length;
      fadingRef.current = true;
      setFading(true);
      setTimeout(() => {
        setActiveIdx(next);
        setFading(false);
        fadingRef.current = false;
      }, 220);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [loopKey, items.length]);

  const goTo = (i: number) => {
    if (i === activeIdx || fadingRef.current) return;
    fadingRef.current = true;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(i);
      setFading(false);
      fadingRef.current = false;
    }, 220);
    setLoopKey(k => k + 1);
  };

  const active = items[activeIdx];
  const ActiveIcon = ICON_MAP[funcionalidades[activeIdx].icon] ?? Shield;

  return (
    <section id="features" className="w-full flex flex-col items-center gap-3">

      {/* Header */}
      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>
      <FadeIn direction="up" delay={0.08}>
        <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-navy text-center leading-[1.2] tracking-[-1px] lg:tracking-[-2px] max-w-[700px]">
          {t("title")}
        </h2>
      </FadeIn>
      <FadeIn direction="up" delay={0.14}>
        <p className="text-[15px] text-navy/60 font-normal text-center max-w-[500px] leading-[1.6]">
          {t("subtitle")}
        </p>
      </FadeIn>

      {/* Body: stacks on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row w-full gap-10 lg:gap-16 mt-10 items-center">

        {/* Phone mockup — top on mobile, right on desktop */}
        <div
          className={cn(
            "flex lg:hidden items-center justify-center w-full",
            "transition-all duration-[220ms] ease-out",
            fading ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100"
          )}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoneFrame scale={0.72}>
              <Image
                key={activeIdx}
                src={FEATURE_IMAGES[activeIdx]}
                alt={active.titulo}
                width={258}
                height={558}
                className="w-full h-full object-cover"
                priority={activeIdx === 0}
              />
            </PhoneFrame>
          </motion.div>
        </div>

        {/* Left: content */}
        <div
          className={cn(
            "w-full lg:w-[445px] lg:flex-shrink-0 flex flex-col justify-center gap-5",
            "transition-all duration-[220ms] ease-out",
            fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy/[0.06] flex items-center justify-center flex-shrink-0">
              <ActiveIcon size={18} strokeWidth={1.5} className="text-navy/70" />
            </div>
            <span className="text-[11px] font-semibold text-navy/50 uppercase tracking-[0.1em]">
              {active.titulo}
            </span>
          </div>

          <h3 className="text-[24px] lg:text-[30px] font-bold text-navy leading-[1.18] tracking-[-1px] lg:tracking-[-1.5px]">
            {active.descripcion}
          </h3>

          <p className="text-[15px] text-navy/65 font-normal leading-[1.65]">
            {active.texto}
          </p>

          <ul className="flex flex-col gap-2.5">
            {active.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-primary flex-shrink-0" />
                <span className="text-[14px] text-navy/80 font-normal leading-[1.55]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Feature ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeIdx
                    ? "w-5 h-[6px] bg-navy"
                    : "w-[6px] h-[6px] bg-navy/25 hover:bg-navy/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: phone mockup — desktop only */}
        <div
          className={cn(
            "hidden lg:flex flex-1 items-center justify-center",
            "transition-all duration-[220ms] ease-out",
            fading ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100"
          )}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoneFrame>
              <Image
                key={activeIdx}
                src={FEATURE_IMAGES[activeIdx]}
                alt={active.titulo}
                width={258}
                height={558}
                className="w-full h-full object-cover"
                priority={activeIdx === 0}
              />
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
