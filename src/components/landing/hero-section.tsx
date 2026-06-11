"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { MetricCard, PaymentCard } from "@/components/molecules/hero-stats-card";
import hero1 from "@/assets/hero/hero1.png";
import hero2 from "@/assets/hero/hero2.jpeg";


export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section id="inicio" className="w-full">
      <div className="flex gap-0 w-full">

        {/* Left side */}
        <div className="flex flex-col justify-center gap-6 flex-1 pr-4">
          <FadeIn direction="right" delay={0}>
            <h1 className="text-[46px] font-bold text-navy leading-[1.304] tracking-[-2px]">
              {t("headline")}
            </h1>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <p className="text-body-md text-navy font-normal leading-[1.5]">
              {t("subtitle")}
            </p>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                style={{ width: 172 }}
                onClick={() =>
                  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("cta_primary")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                style={{ width: 172 }}
                onClick={() =>
                  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("cta_secondary")}
              </Button>
            </div>
          </FadeIn>

          {/* <FadeIn direction="right" delay={0.3}>
            <p className="text-body-sm text-navy/60 font-medium">
              {t("social_proof")}
            </p>
          </FadeIn> */}
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center gap-4 flex-1 pl-4">
          <FadeIn direction="left" delay={0.15}>
            <div className="flex gap-2.5 h-[200px]">
              <div className="flex-1 relative rounded-chip overflow-hidden" style={{ maxWidth: 280 }}>
                <Image src={hero1} alt="" fill className="object-cover object-center" />
              </div>
              <MetricCard
                value="95%"
                label={t("metric_label")}
                className="w-[198px] h-full"
              />
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.25}>
            <div className="flex gap-2.5 h-[200px]">
              <PaymentCard
                amount="$25,000"
                unit={t("payment_unit")}
                status={t("payment_status")}
                className="w-[198px] h-full"
              />
              <div className="flex-1 relative rounded-chip overflow-hidden" style={{ maxWidth: 280 }}>
                <Image src={hero2} alt="" fill className="object-cover object-center" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
