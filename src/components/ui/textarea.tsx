"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-body-sm font-medium text-navy">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-sm bg-white",
            "px-4 py-3",
            "text-body-md text-navy font-normal",
            "placeholder:text-gray",
            "border border-[#d9d9d9]",
            "outline-none transition-colors duration-200 resize-vertical",
            "focus:border-primary focus:border-[1.5px]",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-body-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
