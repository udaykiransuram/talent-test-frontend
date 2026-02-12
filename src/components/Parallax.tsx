"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** How much to move relative to scroll (0.02–0.15 recommended). Positive moves slower upward */
  speed?: number;
}

export default function Parallax({ children, className, speed = 0.06 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion and disable parallax on small screens for performance
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches; // ~md breakpoint

    if (prefersReduced || isSmallScreen) {
      // Disable transform and skip scroll listeners on mobile/reduced-motion
      el.style.transform = "none";
      return;
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const offset = y * speed * -1; // slight upward drift on scroll
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
