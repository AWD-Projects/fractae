"use client";

import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends Omit<LinkProps, "className"> {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

/**
 * Navbar anchor from Figma.
 * Figma: Montserrat 14px, fontWeight 500, fill #062244, lineHeight 1.5
 */
export function NavLink({
  children,
  className,
  active = false,
  ...props
}: NavLinkProps) {
  return (
    <Link
      className={cn(
        "text-[14px] font-medium text-navy leading-[1.5]",
        "transition-colors duration-200",
        "hover:text-primary",
        active && "text-primary font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
