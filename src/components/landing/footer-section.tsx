"use client";

import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

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
      <div className="w-full bg-white rounded-[32px] lg:rounded-[48px] px-6 sm:px-10 lg:px-[60px] py-8 lg:py-[36px]">

        {/* Main grid: 1 col mobile → 2 col sm → 5 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-8 lg:gap-10">

          {/* Column 1 — Logo + tagline + CTA — full width on mobile */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Logo width={120} />
            <p className="text-[14px] text-navy font-normal leading-[1.6] max-w-[260px]">
              {t("tagline")}
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-fit"
              onClick={() =>
                (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.("contacto")
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
                  <a href={link.href} className="text-[14px] text-navy hover:text-navy transition-colors duration-150">
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
                  <a href={link.href} className="text-[14px] text-navy hover:text-navy transition-colors duration-150">
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
                  <a href={link.href} className="text-[14px] text-navy hover:text-navy transition-colors duration-150">
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
                className="flex items-center gap-2.5 text-[14px] text-navy hover:text-navy transition-colors duration-150 break-all"
              >
                <Mail size={14} strokeWidth={1.5} className="flex-shrink-0" />
                {t("email")}
              </a>
              <a
                href={`tel:${t("phone").replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-[14px] text-navy hover:text-navy transition-colors duration-150"
              >
                <Phone size={14} strokeWidth={1.5} className="flex-shrink-0" />
                {t("phone")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-8 lg:mt-10 pt-6 lg:pt-7 border-t border-navy/[0.08]">
          <span className="text-[12px] text-navy font-normal text-center sm:text-left">
            {t("copyright")}
          </span>
          <a
            href="https://www.amoxtli.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-navy font-normal hover:underline"
          >
            {t("developed_by")}
          </a>
        </div>
      </div>
    </footer>
  );
}
