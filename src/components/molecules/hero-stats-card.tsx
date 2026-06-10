import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Blue metric card — Figma: Card-2, fill #27B8FF, cornerRadius 48,
 * padding [10,28], gap 13, width 198, height fill_container.
 * Content: TrendingUp icon (lucide, stroke white) + "95%" (28/600) + label (22/normal)
 */
export function MetricCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3 rounded-chip bg-secondary",
        "px-7 py-2.5",
        className
      )}
    >
      {/* Icon — Figma: lucide/trending-up 39×39 frame, stroke white, strokeWidth 2 */}
      <div className="w-[39px] h-[39px] flex items-center justify-center">
        <TrendingUp
          size={32.5}
          strokeWidth={2}
          className="text-background"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </div>

      {/* Value — Figma: 28/600, fill #FBFBFB, letterSpacing 0.1, lineHeight 0.714 */}
      <p
        className="text-[28px] font-semibold text-background leading-[0.714] tracking-[0.1px]"
        style={{ textAlignVertical: "middle" } as React.CSSProperties}
      >
        {value}
      </p>

      {/* Label — Figma: 22/normal, fill #FBFBFB, letterSpacing 0.1, lineHeight 0.909 */}
      <p className="text-[22px] text-background font-normal leading-[0.909] tracking-[0.1px]">
        {label}
      </p>
    </div>
  );
}

/**
 * White payment card — Figma: Card-3 (VcoDq).
 * fill white, cornerRadius 48, padding [10,24], gap 19, vertical, justifyContent center, alignItems center.
 * Row: owner name (left) + unit (right), 10/500, navy/50%.
 * Amount: 32/700, navy, center.
 * Status: 12/600, warning (#FACC15), center.
 */
export function PaymentCard({
  amount,
  status,
  ownerName = "Juan Manuel",
  unit = "Casa 14",
  className,
}: {
  amount: string;
  status: string;
  ownerName?: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-[19px] rounded-chip bg-white",
        "px-6 py-2.5",
        className
      )}
    >
      {/* Owner row — Figma: pznsM, horizontal, gap 10, width 116 */}
      <div className="flex items-center justify-between gap-2.5 w-[116px]">
        <span className="text-[10px] font-medium text-navy/50 leading-[2] tracking-[0.1px] whitespace-nowrap">
          {ownerName}
        </span>
        <span className="text-[10px] font-normal text-navy/50 leading-[2] tracking-[0.1px] text-right whitespace-nowrap">
          {unit}
        </span>
      </div>

      {/* Amount — Figma: eYcHY, 32/700, fill #062244, lineHeight 0.625 */}
      <p className="text-[32px] font-bold text-navy text-center leading-[0.625] tracking-[0.1px] w-full">
        {amount}
      </p>

      {/* Status — Figma: TIdwd, 12/600, fill #FACC15, lineHeight 1.667 */}
      <p className="text-[12px] font-semibold text-warning text-center leading-[1.667] tracking-[0.1px]">
        {status}
      </p>
    </div>
  );
}
