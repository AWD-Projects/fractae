"use client";

import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export function FooterSection() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const productLinks = [
    { label: tn("inicio"),      href: "#inicio" },
    { label: tn("features"),    href: "#features" },
    { label: tn("beneficios"),  href: "#beneficios" },
    { label: tn("planes"),      href: "#planes" },
    { label: tn("faq"),         href: "#faq" },
  ];

  const companyLinks = [
    { label: "Sobre nosotros", href: "#" },
    { label: "Blog",           href: "#" },
    { label: "Carreras",       href: "#" },
  ];

  const legalLinks = [
    { label: t("privacy"), href: "#" },
    { label: t("terms"),   href: "#" },
  ];

  return (
    <footer className="w-full pt-6">
      <FadeIn direction="up" delay={0.1}>
        <div className="w-full bg-white rounded-[48px] px-[60px] py-[36px]">

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-10">

            {/* Column 1 — Logo + tagline + CTA */}
            <div className="flex flex-col gap-5">
              <Logo width={140} />
              <p className="text-[14px] text-navy/60 font-normal leading-[1.6] max-w-[220px]">
                {t("tagline")}
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-fit"
                onClick={() =>
                  (window as Record<string, unknown>).__snapTo?.("contacto")
                }
              >
                {t("cta")}
              </Button>
            </div>

            {/* Column 2 — Producto */}
            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">
                {t("product")}
              </span>
              <ul className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[14px] text-navy/70 hover:text-navy transition-colors duration-150">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Empresa */}
            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">
                {t("company")}
              </span>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-navy/70 hover:text-navy transition-colors duration-150">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Legal */}
            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">
                Legal
              </span>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-navy/70 hover:text-navy transition-colors duration-150">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5 — Contacto */}
            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">
                {t("contact")}
              </span>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${t("email")}`}
                  className="flex items-center gap-2.5 text-[14px] text-navy/70 hover:text-navy transition-colors duration-150"
                >
                  <Mail size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  {t("email")}
                </a>
                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-[14px] text-navy/70 hover:text-navy transition-colors duration-150"
                >
                  <Phone size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  {t("phone")}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-10 pt-7 border-t border-navy/[0.08]">
            <span className="text-[12px] text-navy/40 font-normal">
              {t("copyright")}
            </span>
            <span className="text-[12px] text-navy/40 font-normal">
              {t("developed_by")}
            </span>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}
