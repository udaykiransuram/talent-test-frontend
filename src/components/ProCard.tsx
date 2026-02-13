"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  accent?: "teal" | "emerald" | "cyan" | "blue" | "indigo";
  className?: string;
}

// Explicit class maps so Tailwind includes these in the build
const accentStyles: Record<NonNullable<ProCardProps["accent"]>, {
  border: string;
  topBar: string;
  iconBg: string;
  iconText: string;
}> = {
  teal:    { border: "border-teal-500/20",    topBar: "bg-teal-400/40",    iconBg: "bg-teal-500/10",    iconText: "text-teal-600 dark:text-teal-300" },
  emerald: { border: "border-emerald-500/20", topBar: "bg-emerald-400/40", iconBg: "bg-emerald-500/10", iconText: "text-emerald-600 dark:text-emerald-300" },
  cyan:    { border: "border-cyan-500/20",    topBar: "bg-cyan-400/40",    iconBg: "bg-cyan-500/10",    iconText: "text-cyan-600 dark:text-cyan-300" },
  blue:    { border: "border-blue-500/20",    topBar: "bg-blue-400/40",    iconBg: "bg-blue-500/10",    iconText: "text-blue-600 dark:text-blue-300" },
  indigo:  { border: "border-indigo-500/20",  topBar: "bg-indigo-400/40",  iconBg: "bg-indigo-500/10",  iconText: "text-indigo-600 dark:text-indigo-300" },
};

export function ProCard({ icon, title, description, accent = "teal", className }: ProCardProps) {
  const styles = accentStyles[accent];

  // Clean, valid glassmorphism card
  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border",
        // Professional glass surface with good readability on busy backgrounds
        "bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-6 md:p-7 flex flex-col gap-4 transition-all duration-300",
        // Subtle border and elevation; refined hover
        "border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-slate-900/50",
        className
      )}
    >
      {/* Hover sheen for premium glass feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />

      {/* Top accent bar removed per feedback for a cleaner glass look */}

      <div className="relative z-10 flex items-start gap-4 md:gap-5">
        {icon && (
          <div
            className={cn(
              // Icon badge (transparent with hover lift)
              "flex h-12 w-12 md:h-14 md:w-14 flex-none items-center justify-center rounded-xl border text-2xl md:text-3xl shadow-sm bg-white/70 dark:bg-white/10 border-slate-200/60 dark:border-white/10 transition-transform duration-300 group-hover:scale-110",
              styles.iconText
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 mb-1.5">{title}</h3>
          <p className="text-sm md:text-base leading-relaxed text-slate-700/90">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProCard;

// dev-hmr-check: safe no-op comment to confirm HMR and auto-reload are working
