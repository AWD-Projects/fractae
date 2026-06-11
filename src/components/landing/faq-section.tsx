"use client";

import { useTranslations } from "next-intl";
import { FAQItem } from "@/components/molecules/faq-item";
import { FadeIn } from "@/components/ui/fade-in";

export function FAQSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="w-full flex flex-col gap-8">

      <FadeIn direction="up" delay={0}>
        <h2 className="text-[36px] font-medium text-navy leading-[1.3] tracking-[-2px]">
          {t("title")}
        </h2>
      </FadeIn>

      <FadeIn direction="up" delay={0.15} className="flex flex-col gap-5 w-full">
        {items.map((item, i) => (
          <FAQItem
            key={i}
            question={item.q}
            answer={item.a}
            defaultOpen={i === 0}
          />
        ))}
      </FadeIn>
    </section>
  );
}
