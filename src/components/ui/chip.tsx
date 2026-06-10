import { cn } from "@/lib/utils";

export interface ChipProps {
  children: React.ReactNode;
  className?: string;
  /** "default" = navy border on light bg · "light" = white border on dark bg */
  variant?: "default" | "light";
}

/**
 * Section-header badge from Figma.
 * Figma: cornerRadius 8, h-32px, padding [6,16], border #062244B2 (~70% navy)
 */
export function Chip({ children, className, variant = "default" }: ChipProps) {
  return (
    <div
      className={cn(
        // Figma: h=32, padding [6,16], cornerRadius=8 (rounded-sm in config)
        "inline-flex items-center justify-center h-8 px-4 rounded-sm",
        "text-[14px] font-medium leading-[1.5]",
        variant === "default" && "border border-navy/70 text-navy",
        variant === "light" && "border border-background/70 text-background",
        className
      )}
    >
      {children}
    </div>
  );
}
