import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  /** Lucide icon component */
  Icon: LucideIcon;
  title: string;
  description: string;
  /** Render the larger variant used in the Features left panel (icon 60px, title 28px) */
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Benefit / Feature card atom.
 *
 * SM variant — Benefits grid (Figma Card-1…6):
 *   icon 40×40, title 16/500 navy lh2.375, desc 13px navy lh1.846, gap 20
 *
 * LG variant — Features left panel (Figma Left-side):
 *   icon 60×60, title 28/500 navy tracking-[-2px] lh1.357, desc 20px navy lh1.2, gap 20
 */
export function FeatureCard({
  Icon,
  title,
  description,
  size = "sm",
  className,
}: FeatureCardProps) {
  const isLg = size === "lg";

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Icon wrapper — Figma: lucide icon, stroke navy, no fill on frame */}
      <div
        className={cn(
          "flex items-center justify-center flex-shrink-0",
          isLg ? "w-[60px] h-[60px]" : "w-[40px] h-[40px]"
        )}
      >
        <Icon
          size={isLg ? 50 : 33}
          strokeWidth={isLg ? 4 : 2}
          className="text-navy"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </div>

      {/* Title */}
      <p
        className={cn(
          "font-medium text-navy",
          isLg
            ? "text-[28px] leading-[1.357] tracking-[-2px]"
            : "text-body-md leading-[2.375]"
        )}
      >
        {title}
      </p>

      {/* Description */}
      <p
        className={cn(
          "text-navy font-normal",
          isLg
            ? "text-[20px] leading-[1.2]"
            : "text-[13px] leading-[1.846]"
        )}
      >
        {description}
      </p>
    </div>
  );
}
