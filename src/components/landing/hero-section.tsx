"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MetricCard, PaymentCard } from "@/components/molecules/hero-stats-card";
import hero1 from "@/assets/hero/hero1.png";
import hero2 from "@/assets/hero/hero2.jpeg";

const EASE = [0.4, 0, 0.2, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: EASE },
});

const fadeRight = (delay: number) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.75, delay, ease: EASE },
});

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section id="inicio" className="w-full">
      <div className="flex gap-0 w-full">

        {/* ── Left ── */}
        <div className="flex flex-col justify-center gap-6 flex-1 pr-4">

          <motion.div {...fadeUp(0.1)}>
            <h1 className="hero-gradient-text text-[46px] font-bold leading-[1.304] tracking-[-2px]">
              {t("headline")}
            </h1>
          </motion.div>

          <motion.div {...fadeUp(0.55)}>
            <p className="text-body-md text-navy font-normal leading-[1.5]">
              {t("subtitle")}
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.8)}>
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                style={{ width: 172 }}
                onClick={() =>
                  (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.("contacto")
                }
              >
                {t("cta_primary")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                style={{ width: 172 }}
                onClick={() =>
                  (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.("contacto")
                }
              >
                {t("cta_secondary")}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* ── Right ── */}
        <div className="flex flex-col justify-center gap-4 flex-1 pl-4">

          <motion.div {...fadeRight(0.45)}>
            <div className="flex gap-2.5 h-[200px]">
              <div className="flex-1 relative rounded-chip overflow-hidden" style={{ maxWidth: 280 }}>
                <Image src={hero1} alt="" fill className="object-cover object-center" />
              </div>
              <MetricCard value="95%" label={t("metric_label")} className="w-[198px] h-full" />
            </div>
          </motion.div>

          <motion.div {...fadeRight(0.65)}>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
