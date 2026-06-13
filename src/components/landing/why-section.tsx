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

      <div className="flex flex-col lg:flex-row w-full mt-8 gap-10 lg:gap-0">

        <FadeIn direction="up" delay={0.15} className="flex flex-col flex-1 gap-6 lg:pr-8">
          <p className="text-[22px] lg:text-[28px] font-medium text-navy text-center tracking-[-1px] lg:tracking-[-2px] leading-[1.2]">
            {t("without")}
          </p>
          <div className="flex flex-col gap-5">
            {problems.map((item, i) => (
              <FadeIn key={i} direction="up" delay={0.2 + i * 0.07}>
                <ComparisonItem type="problem" title={item.title} description={item.desc} />
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Vertical divider — desktop only */}
        <div className="hidden lg:block w-px bg-black/[0.06] mx-8 self-stretch" />
        {/* Horizontal divider — mobile only */}
        <div className="block lg:hidden h-px w-full bg-black/[0.06]" />

        <FadeIn direction="up" delay={0.15} className="flex flex-col flex-1 gap-6 lg:pl-8">
          <p className="text-[22px] lg:text-[28px] font-medium text-navy text-center tracking-[-1px] lg:tracking-[-2px] leading-[1.2]">
            {t("with")}
          </p>
          <div className="flex flex-col gap-5">
            {solutions.map((item, i) => (
              <FadeIn key={i} direction="up" delay={0.2 + i * 0.07}>
                <ComparisonItem type="solution" title={item.title} description={item.desc} />
              </FadeIn>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
