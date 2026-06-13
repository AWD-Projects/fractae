"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/chip";
import { ContactForm } from "@/components/molecules/contact-form";
import { FadeIn } from "@/components/ui/fade-in";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contacto" className="w-full flex flex-col items-center gap-3">

      <FadeIn direction="up" delay={0}>
        <Chip variant="default">{t("label")}</Chip>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <h2 className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium text-navy text-center leading-[1.3] tracking-[-1px] lg:tracking-[-2px] max-w-[800px]">
          {t("title")}
        </h2>
      </FadeIn>

      <FadeIn direction="up" delay={0.15}>
        <p className="text-body-lg text-navy/60 font-normal text-center max-w-[800px]">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn direction="up" delay={0.25} className="w-full max-w-[560px] pt-6">
        <ContactForm />
      </FadeIn>
    </section>
  );
}
