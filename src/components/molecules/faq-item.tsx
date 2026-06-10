"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Expandable FAQ row.
 *
 * Figma: horizontal flex, width fill_container, border-bottom #B3B3B3.
 * FAQ-text: padding [20,0], gap 10 (question + answer stacked), width 1003 (fill).
 * Plus icon: 24×24 frame, lucide plus/minus, fill navy.
 */
export function FAQItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "flex items-center w-full border-b border-gray",
        className
      )}
    >
      {/* Text column — Figma: FAQ-text, padding [20,0], gap 10 */}
      <div className="flex flex-col flex-1 gap-2.5 py-5">
        {/* Question — Figma: Montserrat 16/600 navy */}
        <p className="text-body-md font-semibold text-navy leading-[1.5]">
          {question}
        </p>
        {/* Answer — visible when open */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <p className="text-body-md text-navy font-normal leading-[1.5] pb-1">
            {answer}
          </p>
        </div>
      </div>

      {/* Toggle icon — Figma: 24×24 lucide plus, fill navy */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-navy ml-4 transition-transform duration-200"
        aria-label={open ? "Cerrar" : "Abrir"}
      >
        {open ? (
          <Minus size={14} strokeWidth={2} strokeLinecap="round" />
        ) : (
          <Plus size={14} strokeWidth={2} strokeLinecap="round" />
        )}
      </button>
    </div>
  );
}
