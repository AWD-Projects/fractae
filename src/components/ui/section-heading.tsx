import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  title: string;
  /** Word or phrase inside title to highlight in secondary colour */
  highlight?: string;
  align?: "left" | "center";
  /** "md"=28px · "lg"=36px (default) · "xl"=40px */
  size?: "md" | "lg" | "xl";
  /** Use light (white) text for dark-background sections */
  light?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Reusable section title atom.
 *
 * Figma values:
 *  - 36px sections: fontWeight 500, letterSpacing -2px, lineHeight 1.3, navy, center
 *  - 40px Planes: fontWeight 700, color #FBFBFB
 *  - 28px panels: fontWeight 500, letterSpacing -2px, lineHeight 2.14
 */
export function SectionHeading({
  title,
  highlight,
  align = "center",
  size = "lg",
  light = false,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const base = cn(
    "font-sans tracking-[-2px] leading-[1.3]",
    size === "md" && "text-[28px] font-medium leading-[2.14]",
    size === "lg" && "text-[36px] font-medium",
    size === "xl" && "text-[40px] font-bold",
    light ? "text-background" : "text-navy",
    align === "center" && "text-center",
    className
  );

  if (!highlight) {
    return <Tag className={base}>{title}</Tag>;
  }

  const idx = title.indexOf(highlight);
  if (idx === -1) return <Tag className={base}>{title}</Tag>;

  return (
    <Tag className={base}>
      {title.slice(0, idx)}
      <span className={light ? "text-secondary" : "text-secondary"}>
        {highlight}
      </span>
      {title.slice(idx + highlight.length)}
    </Tag>
  );
}
