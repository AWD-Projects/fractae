"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import meshGradient from "@/assets/bg-images/mesh-gradient.jpg";
import type { PlanesConfig } from "@/types";

interface PlansSectionProps {
  data?: PlanesConfig | null;
}

export function PlansSection({ data }: PlansSectionProps) {
  const t = useTranslations("plans");

  const titulo      = data?.titulo      ?? t("title")
  const subtitulo   = data?.subtitulo   ?? t("subtitle")
  const descripcion = data?.descripcion ?? t("description")
  const ctaTexto    = data?.cta_texto   ?? t("cta")
  const trustItems  = (data?.trust_items as string[] | undefined) ?? (t.raw("trust") as string[])

  return (
    <section id="planes" className="w-full">
      <div
        className="relative w-full rounded-[32px] lg:rounded-[48px] overflow-hidden py-14 lg:py-[84px] px-0"
        style={{ minHeight: 480 }}
      >
        <Image
          src={meshGradient}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        <div className="relative z-10 flex flex-col items-center gap-3 px-6 sm:px-12 lg:px-[84px]">

          <FadeIn direction="up" delay={0}>
            <Chip variant="light">{t("label")}</Chip>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-background text-center leading-[1.3] tracking-[-1px] lg:tracking-[-2px] max-w-[700px]">
              {titulo}
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className="flex flex-col items-center gap-6 lg:gap-9 pt-8 lg:pt-10 w-full">
            <p className="text-[24px] lg:text-[36px] text-background font-normal text-center leading-[1.2]">
              {subtitulo}
            </p>

            <p className="text-[16px] lg:text-[24px] text-background font-normal text-center leading-[1.4] max-w-[640px]">
              {descripcion}
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                className="w-[172px] bg-background text-navy hover:bg-background hover:text-navy border-0 btn-shine"
                onClick={() =>
                  (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.("contacto")
                }
              >
                {ctaTexto}
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3} className="flex flex-wrap items-center justify-center gap-4 lg:gap-[60px] pt-7">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={14} strokeWidth={2} className="text-background/70" />
                <span className="text-[12px] font-semibold text-background leading-[1.5]">
                  {item}
                </span>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
