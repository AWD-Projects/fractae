"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Shield, DollarSign, MessageSquare, BarChart2, CalendarDays, Users,
  type LucideIcon,
} from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/molecules/feature-card";
import { FadeIn } from "@/components/ui/fade-in";
import { funcionalidades } from "@/data/mock";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, DollarSign, MessageSquare, BarChart2, CalendarDays, Users,
};

type FeatureItem = { titulo: string; descripcion: string; bullets: string[] };

export function FeaturesSection() {
  const t = useTranslations("features");
  const [activeIdx, setActiveIdx] = useState(0);

  const items = t.raw("items") as FeatureItem[];
  const active = items[activeIdx];
  const ActiveIcon = ICON_MAP[funcionalidades[activeIdx].icon] ?? Shield;

  return (
    <section id="features" className="w-full flex flex-col items-center gap-3 py-[120px]">

      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>

      <FadeIn direction="up" delay={0.08}>
        <SectionHeading title={t("title")} align="center" size="lg" />
      </FadeIn>

      <FadeIn direction="up" delay={0.14}>
        <p className="text-body-md text-navy/70 font-normal text-center max-w-[600px]">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn direction="up" delay={0.2} className="flex items-center gap-2 mt-4 flex-wrap justify-center">
        {funcionalidades.map((f, i) => {
          const TabIcon = ICON_MAP[f.icon] ?? Shield;
          return (
            <button
              key={f.id}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "flex items-center gap-2 h-10 px-5 rounded-full text-[14px] font-medium",
                "transition-all duration-200 border",
                i === activeIdx
                  ? "bg-navy text-background border-navy"
                  : "bg-transparent text-navy border-navy/30 hover:border-navy/60"
              )}
            >
              <TabIcon size={14} strokeWidth={2} />
              {items[i].titulo}
            </button>
          );
        })}
      </FadeIn>

      <div className="flex w-full h-[480px] mt-4">

        <FadeIn direction="right" delay={0.25} className="w-[445px] flex flex-col justify-center gap-5 flex-shrink-0">
          <FeatureCard
            Icon={ActiveIcon}
            title={active.titulo}
            description={active.descripcion}
            size="lg"
          />
          <ul className="flex flex-col gap-3 mt-2">
            {active.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-body-md text-navy font-normal leading-[1.5]">{bullet}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn direction="left" delay={0.25} className="flex-1 pl-4 flex items-center justify-center">
          <div
            className={cn(
              "w-full h-full rounded-chip overflow-hidden",
              "bg-gradient-to-br from-secondary/20 via-primary/10 to-navy/5",
              "flex items-center justify-center"
            )}
          >
            <div className="relative w-[200px] h-[400px] bg-navy/80 rounded-[32px] shadow-modal overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary/20" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/20 rounded-full" />
              <div className="absolute inset-4 top-12 bg-white/5 rounded-2xl" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
