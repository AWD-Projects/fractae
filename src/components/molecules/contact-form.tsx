"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

/**
 * Multi-step contact form from Figma "Contacto" section.
 *
 * Step 1 — name input (Figma: "¿Cuál es tu nombre?", Input Field, Continuar →)
 * Step 2 — channel choice (WhatsApp | Email)
 * Step 3 — contact field + submit
 * Success — confirmation message
 *
 * Figma: layout vertical, gap 20, justifyContent center, width fill_container.
 * Question text: Montserrat 24/500 navy, letterSpacing -2px, lineHeight 1.583.
 * Buttons row: horizontal flex, gap 10, justifyContent center.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nombre: "", canal: "whatsapp", contacto: "" },
  });

  const canal = watch("canal");

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        {/* Figma: success_title, success_subtitle */}
        <p className="text-[36px] font-bold text-navy tracking-[-2px]">
          {t("success_title")}
        </p>
        <p className="text-body-lg text-navy font-normal">
          {t("success_subtitle")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-5 w-full"
    >
      {/* ── Step 1: Name ── */}
      <div
        className={cn(
          "flex flex-col items-center gap-5 w-full transition-all duration-300",
          step !== 1 && "hidden"
        )}
      >
        {/* Question — Figma: fontSize 24, fontWeight 500, letterSpacing -2, lineHeight 1.583 */}
        <p className="text-[24px] font-medium text-navy text-center tracking-[-2px] leading-[1.583]">
          {t("step1_label")}
        </p>

        {/* Input — Figma: cornerRadius 8, border #D9D9D9, padding [12,16], width 214 */}
        <div className="w-[214px]">
          <Input
            {...register("nombre")}
            placeholder={t("step1_placeholder")}
            error={errors.nombre?.message}
          />
        </div>

        {/* CTA — Figma: Button 172×48, fill navy */}
        <div className="flex justify-center gap-2.5 pt-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            style={{ width: 172 }}
            onClick={() => {
              // eslint-disable-next-line react-hooks/incompatible-library
              if (watch("nombre").length >= 2) setStep(2);
            }}
          >
            {t("continue")}
          </Button>
        </div>
      </div>

      {/* ── Step 2: Channel ── */}
      <div
        className={cn(
          "flex flex-col items-center gap-5 w-full transition-all duration-300",
          step !== 2 && "hidden"
        )}
      >
        <p className="text-[24px] font-medium text-navy text-center tracking-[-2px] leading-[1.583]">
          {t("step2_label")}
        </p>

        <div className="flex gap-3">
          <ChannelButton
            active={canal === "whatsapp"}
            onClick={() => setValue("canal", "whatsapp")}
            label={t("channel_whatsapp")}
          />
          <ChannelButton
            active={canal === "email"}
            onClick={() => setValue("canal", "email")}
            label={t("channel_email")}
          />
        </div>

        <div className="flex justify-center gap-2.5 pt-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            style={{ width: 172 }}
            onClick={() => setStep(1)}
          >
            {t("back")}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            style={{ width: 172 }}
            onClick={() => setStep(3)}
          >
            {t("continue")}
          </Button>
        </div>
      </div>

      {/* ── Step 3: Contact detail ── */}
      <div
        className={cn(
          "flex flex-col items-center gap-5 w-full transition-all duration-300",
          step !== 3 && "hidden"
        )}
      >
        <p className="text-[24px] font-medium text-navy text-center tracking-[-2px] leading-[1.583]">
          {canal === "whatsapp" ? t("step3_whatsapp") : t("step3_email")}
        </p>

        <div className="w-[214px]">
          <Input
            {...register("contacto")}
            type={canal === "email" ? "email" : "tel"}
            placeholder={
              canal === "whatsapp"
                ? t("step3_placeholder_wa")
                : t("step3_placeholder_email")
            }
            error={errors.contacto?.message}
          />
        </div>

        <div className="flex justify-center gap-2.5 pt-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            style={{ width: 172 }}
            onClick={() => setStep(2)}
          >
            {t("back")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            style={{ width: 172 }}
            disabled={loading}
          >
            {loading ? "..." : t("submit")}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── Channel selector button ──────────────────────────────────────────────────

interface ChannelButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function ChannelButton({ active, onClick, label }: ChannelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 px-7 rounded-full text-[15px] font-medium transition-all duration-200",
        "border-2",
        active
          ? "bg-navy text-background border-navy"
          : "bg-transparent text-navy border-navy hover:bg-navy/5"
      )}
    >
      {label}
    </button>
  );
}
