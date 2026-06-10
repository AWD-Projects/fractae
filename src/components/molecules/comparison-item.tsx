import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComparisonItemProps {
  type: "problem" | "solution";
  title: string;
  description: string;
  className?: string;
}

/**
 * Single row in the "Sin/Con FRACTAE" comparison panel.
 *
 * Figma: gap 10, icon frame 29×29 (lucide X or Check), text column gap 10.
 * Problem title: Montserrat 20/600 navy · description: 16/normal navy, lineHeight 1.5
 */
export function ComparisonItem({
  type,
  title,
  description,
  className,
}: ComparisonItemProps) {
  const isProb = type === "problem";

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {/* Icon — Figma: 29×29 frame, lucide X (fill #DC2626) or Check (fill #059669) */}
      <div className="flex-shrink-0 w-[29px] h-[29px] flex items-center justify-center">
        {isProb ? (
          <X
            size={14.5}
            strokeWidth={2}
            className="text-error"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Check
            size={19.3}
            strokeWidth={2}
            className="text-success"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </div>

      {/* Text column — Figma: gap 10, fill_container */}
      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        {/* Figma: fontSize 20, fontWeight 600, lineHeight 1.2 */}
        <p className="text-[20px] font-semibold text-navy leading-[1.2]">
          {title}
        </p>
        {/* Figma: fontSize 16, fontWeight normal, lineHeight 1.5 */}
        <p className="text-body-md text-navy leading-[1.5] font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}
