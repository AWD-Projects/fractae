"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import meshGradient from "@/assets/bg-images/mesh-gradient.jpg";

export function PlansSection() {
  const t = useTranslations("plans");
  const trust = t.raw("trust") as string[];

  return (
    <section id="planes" className="w-full mb-[120px] mt-[120px]">
      <div
        className="relative w-full rounded-[48px] overflow-hidden py-[84px] px-0"
        style={{ minHeight: 584 }}
      >
        <Image
          src={meshGradient}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        <div className="relative z-10 flex flex-col items-center gap-3 px-[84px]">

          <FadeIn direction="up" delay={0}>
            <Chip variant="light">{t("label")}</Chip>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-[40px] font-bold text-background text-center leading-[1.3] tracking-[-2px] max-w-[700px]">
              {t("title")}
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className="flex flex-col items-center gap-9 pt-10 w-full">
            <p className="text-[36px] text-background font-normal text-center leading-[1.2]">
              {t("subtitle")}
            </p>

            <p className="text-[24px] text-background font-normal text-center leading-[1.4] max-w-[640px]">
              {t("description")}
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                style={{ width: 172 }}
                className="bg-background text-navy hover:bg-background/90 hover:text-navy border-0"
                onClick={() =>
                  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("cta")}
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3} className="flex items-center justify-center gap-[60px] pt-7">
            {trust.map((item, i) => (
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
