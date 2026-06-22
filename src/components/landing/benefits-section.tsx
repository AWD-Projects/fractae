"use client";

import { useTranslations } from "next-intl";
import * as LucideIcons from "lucide-react";
import { Zap, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/molecules/feature-card";
import { FadeIn } from "@/components/ui/fade-in";

function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name];
  if (icon != null && typeof icon !== "string" && typeof icon !== "number" && typeof icon !== "boolean") {
    return icon as LucideIcon;
  }
  return Zap;
}

type DbBeneficio = {
  titulo: string;
  descripcion: string;
  icono: string;
};

type BenefitItem = { titulo: string; descripcion: string };

interface BenefitsSectionProps {
  dbBeneficios?: DbBeneficio[];
}

export function BenefitsSection({ dbBeneficios = [] }: BenefitsSectionProps) {
  const t = useTranslations("benefits");
  const i18nItems = t.raw("items") as BenefitItem[];

  const usingDb = dbBeneficios.length > 0;
  const items = usingDb ? dbBeneficios : i18nItems;

  return (
    <section id="beneficios" className="w-full flex flex-col items-center gap-3">

      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <SectionHeading title={t("title")} align="center" size="lg" />
      </FadeIn>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {items.map((item, i) => {
          const Icon = usingDb
            ? resolveIcon((item as DbBeneficio).icono)
            : Zap;
          return (
            <FadeIn key={i} direction="up" delay={0.1 + i * 0.08}>
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
                  Icon={Icon}
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
