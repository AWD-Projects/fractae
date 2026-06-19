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

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {beneficios.map((b, i) => {
          const BIcon = ICON_MAP[b.icono] ?? Zap;
          const item = items[i];
          return (
            <FadeIn key={b.id} direction="up" delay={0.1 + i * 0.08}>
              <motion.div
                className="p-6 rounded-card border border-transparent"
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  borderColor: "rgba(6,34,68,0.07)",
                  boxShadow: "0 12px 32px rgba(6,34,68,0.07)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <FeatureCard
                  Icon={BIcon}
                  title={item.titulo}
                  description={item.descripcion}
                  size="sm"
                />
              </motion.div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
