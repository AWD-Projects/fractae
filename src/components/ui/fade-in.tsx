"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

const INITIAL: Record<string, { opacity: number; y?: number; x?: number }> = {
  up:    { opacity: 0, y: 24 },
  down:  { opacity: 0, y: -24 },
  left:  { opacity: 0, x: 24 },
  right: { opacity: 0, x: -24 },
  none:  { opacity: 0 },
};

const ANIMATE: Record<string, { opacity: number; y?: number; x?: number }> = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  none:  { opacity: 1 },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.7,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={INITIAL[direction]}
      whileInView={ANIMATE[direction]}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
