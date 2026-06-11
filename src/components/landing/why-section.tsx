"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { ComparisonItem } from "@/components/molecules/comparison-item";
import { FadeIn } from "@/components/ui/fade-in";

export function WhySection() {
  const t = useTranslations("why");
  const problems = t.raw("problems") as Array<{ title: string; desc: string }>;
  const solutions = t.raw("solutions") as Array<{ title: string; desc: string }>;

  return (
    <section id="fractae" className="w-full flex flex-col items-center gap-3">

      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <SectionHeading title={t("title")} align="center" size="lg" />
      </FadeIn>

      <div className="flex w-full mt-8">

        <FadeIn direction="right" delay={0.2} className="flex flex-col flex-1 gap-6">
          <p className="text-[28px] font-medium text-navy text-center tracking-[-2px] leading-[1.2]">
            {t("without")}
          </p>
          <div className="flex flex-col gap-5">
            {problems.map((item, i) => (
              <ComparisonItem key={i} type="problem" title={item.title} description={item.desc} />
            ))}
          </div>
        </FadeIn>

        <div className="w-px bg-black/[0.06] mx-8 self-stretch" />

        <FadeIn direction="left" delay={0.2} className="flex flex-col flex-1 gap-6">
          <p className="text-[28px] font-medium text-navy text-center tracking-[-2px] leading-[1.2]">
            {t("with")}
          </p>
          <div className="flex flex-col gap-5">
            {solutions.map((item, i) => (
              <ComparisonItem key={i} type="solution" title={item.title} description={item.desc} />
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
