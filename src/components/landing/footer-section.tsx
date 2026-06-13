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

  const snapTo = (id: string) =>
    (window as unknown as { __snapTo?: (id: string) => void }).__snapTo?.(id);

  return (
    <footer className="w-full pt-6">
      <div className="w-full bg-white rounded-[32px] lg:rounded-[48px] px-6 sm:px-10 lg:px-[60px] py-8 lg:py-[36px]">

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col gap-7 lg:hidden">

          {/* Brand row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <Logo width={110} />
              <p className="text-[13px] text-navy/70 font-normal leading-[1.6] max-w-[180px]">
                {t("tagline")}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="flex-shrink-0 mt-1"
              onClick={() => snapTo("contacto")}
            >
              {t("cta")}
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-navy/[0.07]" />

          {/* Links — 2 columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-navy uppercase tracking-[0.1em]">
                {t("product")}
              </span>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[13px] text-navy/70 hover:text-navy transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company + Legal stacked */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-navy uppercase tracking-[0.1em]">
                  {t("company")}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[13px] text-navy/70 hover:text-navy transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-navy uppercase tracking-[0.1em]">
                  Legal
                </span>
                <ul className="flex flex-col gap-2.5">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[13px] text-navy/70 hover:text-navy transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact pills */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-navy uppercase tracking-[0.1em]">
              {t("contact")}
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${t("email")}`}
                className="flex items-center gap-2 bg-navy/[0.04] hover:bg-navy/[0.08] transition-colors rounded-full px-4 py-2"
              >
                <Mail size={13} strokeWidth={1.5} className="text-navy/60 flex-shrink-0" />
                <span className="text-[12px] text-navy font-medium truncate max-w-[180px]">{t("email")}</span>
              </a>
              <a
                href={`tel:${t("phone").replace(/\s/g, "")}`}
                className="flex items-center gap-2 bg-navy/[0.04] hover:bg-navy/[0.08] transition-colors rounded-full px-4 py-2"
              >
                <Phone size={13} strokeWidth={1.5} className="text-navy/60 flex-shrink-0" />
                <span className="text-[12px] text-navy font-medium">{t("phone")}</span>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between pt-5 border-t border-navy/[0.07]">
            <span className="text-[11px] text-navy/50 font-normal">{t("copyright")}</span>
            <a
              href="https://www.amoxtli.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-navy/50 font-normal hover:text-navy transition-colors"
            >
              {t("developed_by")}
            </a>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-10">

            <div className="flex flex-col gap-5">
              <Logo width={140} />
              <p className="text-[14px] text-navy font-normal leading-[1.6] max-w-[220px]">
                {t("tagline")}
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-fit"
                onClick={() => snapTo("contacto")}
              >
                {t("cta")}
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">{t("product")}</span>
              <ul className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[14px] text-navy hover:text-navy/60 transition-colors duration-150">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">{t("company")}</span>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-navy hover:text-navy/60 transition-colors duration-150">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">Legal</span>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-navy hover:text-navy/60 transition-colors duration-150">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold text-navy uppercase tracking-[0.08em]">{t("contact")}</span>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${t("email")}`}
                  className="flex items-center gap-2.5 text-[14px] text-navy hover:text-navy/60 transition-colors duration-150 break-all"
                >
                  <Mail size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  {t("email")}
                </a>
                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-[14px] text-navy hover:text-navy/60 transition-colors duration-150"
                >
                  <Phone size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  {t("phone")}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10 pt-7 border-t border-navy/[0.08]">
            <span className="text-[12px] text-navy font-normal">{t("copyright")}</span>
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

      </div>
    </footer>
  );
}
