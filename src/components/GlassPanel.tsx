"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Override background classes, e.g. "bg-white/5 dark:bg-white/0" */
  bgClassName?: string;
  /** Override blur/saturate classes, e.g. "backdrop-blur-md" */
  blurClassName?: string;
  /** Disable the inner highlight sheen if true */
  noHighlight?: boolean;
  /** Optional border color utility, e.g. "border-white/30" */
  borderClassName?: string;
  /** Optional seamless texture inside the panel (e.g., "/images/tt-black-linen-2.png") */
  textureUrl?: string;
  /** Tailwind opacity utility for texture intensity (e.g., "opacity-10"). Defaults to opacity-10 */
  textureOpacityClass?: string;
  /** Optional white veil overlay to add frost over the texture (e.g., "bg-white/20") */
  veilClassName?: string;
  /** Border radius utility to apply consistently to container and overlays. Defaults to rounded-3xl */
  radiusClassName?: string;
}

/**
 * Reusable glassmorphism panel with subtle teal-friendly border,
 * soft inner highlight and strong backdrop blur.
 */
export default function GlassPanel({ children, className, bgClassName, blurClassName, noHighlight, borderClassName, textureUrl, textureOpacityClass, veilClassName, radiusClassName }: GlassPanelProps) {
  const radius = radiusClassName ?? "rounded-3xl";
  return (
    <div
      className={cn(
        "relative border group",
        radius,
        borderClassName ?? "border-teal-500/20",
        bgClassName ?? "bg-white/5 dark:bg-white/5",
        blurClassName ?? "backdrop-blur-3xl backdrop-saturate-150",
        "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Optional seamless texture layer clipped to panel radius */}
      {textureUrl && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-repeat",
            radius,
            textureOpacityClass ?? "opacity-10"
          )}
          style={{ backgroundImage: `url('${textureUrl}')`, backgroundSize: 'auto' }}
        />
      )}
      {/* Optional veil overlay for frosted effect over texture */}
      {veilClassName && (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", radius, veilClassName)} />
      )}
      {/* Hover sheen for premium glass feel */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          radius
        )}
      />
      {/* Soft inner highlight to enhance glass look */}
      {!noHighlight && (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-[0.12]", radius)} />
      )}
      {children}
    </div>
  );
}
