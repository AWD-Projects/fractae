"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

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
        "flex items-start w-full border-b border-gray",
        className
      )}
    >
      <div className="flex flex-col flex-1 gap-2.5 py-5">
        <p className="text-body-md font-semibold text-navy leading-[1.5]">
          {question}
        </p>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p className="text-body-md text-navy font-normal leading-[1.5] pb-1">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setOpen((p) => !p)}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-navy ml-4 mt-5"
        aria-label={open ? "Cerrar" : "Abrir"}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: "flex" }}
        >
          <Plus size={14} strokeWidth={2} strokeLinecap="round" />
        </motion.span>
      </button>
    </div>
  );
}
