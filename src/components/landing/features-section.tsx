"use client";

import { useState, useEffect, useRef } from "react";
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

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: 276, height: 576 }}>
      {/* Silver metallic rim */}
      <div className="absolute inset-0 rounded-[40px] bg-zinc-500 shadow-[0_28px_72px_rgba(0,0,0,0.40)]" />
      {/* Black glass body */}
      <div className="absolute inset-[2px] rounded-[38px] bg-zinc-950" />
      {/* Screen */}
      <div className="absolute inset-[9px] rounded-[31px] bg-black overflow-hidden">
        {children}
      </div>
      {/* Dynamic island */}
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[86px] h-[24px] bg-zinc-950 rounded-full z-10" />
      {/* Power button (right) */}
      <div className="absolute right-[-2px] top-[108px] w-[3px] h-[52px] bg-zinc-400 rounded-r-full" />
      {/* Mute toggle (left) */}
      <div className="absolute left-[-2px] top-[86px] w-[3px] h-[29px] bg-zinc-400 rounded-l-full" />
      {/* Volume up (left) */}
      <div className="absolute left-[-2px] top-[130px] w-[3px] h-[52px] bg-zinc-400 rounded-l-full" />
      {/* Volume down (left) */}
      <div className="absolute left-[-2px] top-[196px] w-[3px] h-[52px] bg-zinc-400 rounded-l-full" />
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
        <h2 className="text-[40px] font-bold text-navy text-center leading-[1.2] tracking-[-2px] max-w-[700px]">
          {t("title")}
        </h2>
      </FadeIn>
      <FadeIn direction="up" delay={0.14}>
        <p className="text-[15px] text-navy/60 font-normal text-center max-w-[500px] leading-[1.6]">
          {t("subtitle")}
        </p>
      </FadeIn>

      {/* Two-column body */}
      <div className="flex w-full gap-16 mt-10 items-center">

        {/* Left: content */}
        <div
          className={cn(
            "w-[445px] flex-shrink-0 flex flex-col justify-center gap-5",
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

          <h3 className="text-[30px] font-bold text-navy leading-[1.18] tracking-[-1.5px]">
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

        {/* Right: phone mockup */}
        <div
          className={cn(
            "flex-1 flex items-center justify-center",
            "transition-all duration-[220ms] ease-out",
            fading ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100"
          )}
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
        </div>
      </div>
    </section>
  );
}
