"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

/**
 * Text input from Figma Contact form.
 * Figma: cornerRadius 8, border #D9D9D9, padding [12,16], fill white, font 16px
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-body-sm font-medium text-navy"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            // Figma: cornerRadius 8, fill white, stroke #D9D9D9, padding [12,16]
            "w-full rounded-sm bg-white",
            "px-4 py-3",
            "text-body-md text-navy font-normal",
            "placeholder:text-gray",
            "border border-[#d9d9d9]",
            "outline-none transition-colors duration-200",
            "focus:border-primary focus:border-[1.5px]",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-body-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
