"use client";

import { useTranslations } from "next-intl";
import {
  Zap, Eye, Bell, BarChart2, CheckCheck, LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/molecules/feature-card";
import { FadeIn } from "@/components/ui/fade-in";
import { beneficios } from "@/data/mock";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Eye, Bell, BarChart2, CheckCheck, LayoutGrid,
};

type BenefitItem = { titulo: string; descripcion: string };

export function BenefitsSection() {
  const t = useTranslations("benefits");
  const items = t.raw("items") as BenefitItem[];

  return (
    <section id="beneficios" className="w-full flex flex-col items-center gap-3">

      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <SectionHeading title={t("title")} align="center" size="lg" />
      </FadeIn>

      <FadeIn direction="up" delay={0.2} className="w-full grid grid-cols-3 gap-5 mt-4">
        {beneficios.map((b, i) => {
          const BIcon = ICON_MAP[b.icon] ?? Zap;
          const item = items[i];
          return (
            <motion.div
              key={b.id}
              className="p-6 rounded-card"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FeatureCard
                Icon={BIcon}
                title={item.titulo}
                description={item.descripcion}
                size="sm"
              />
            </motion.div>
          );
        })}
      </FadeIn>
    </section>
  );
}
