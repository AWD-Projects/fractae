"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // base
          "inline-flex items-center justify-center font-medium font-sans",
          "transition-all duration-200 cursor-pointer select-none whitespace-nowrap",
          "disabled:opacity-50 disabled:pointer-events-none",
          // sizes — from Figma: h-12 px-7 py-3 (padding [12,28]) text-[15px]
          size === "sm" && "h-9 px-5 text-[13px] rounded-full",
          size === "md" && "h-12 px-7 py-3 text-[15px] rounded-full",
          size === "lg" && "h-14 px-8 text-[16px] rounded-full",
          // primary — Figma fill #062244 (navy), text #FBFBFB, cornerRadius 100
          variant === "primary" && [
            "bg-navy text-background",
            "hover:opacity-90 hover:-translate-y-px hover:shadow-float",
            "active:scale-95",
          ],
          // secondary — outlined navy pill
          variant === "secondary" && [
            "border-2 border-navy text-navy bg-transparent",
            "hover:bg-navy hover:text-background",
            "active:scale-95",
          ],
          // ghost — text-only link style
          variant === "ghost" && [
            "text-primary underline-offset-4",
            "hover:underline",
            "h-auto px-0 py-0 rounded-none",
          ],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
