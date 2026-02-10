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

const accentMap: Record<NonNullable<ProCardProps["accent"]>, string> = {
  teal: "from-teal-100 to-transparent dark:from-teal-900/20",
  emerald: "from-emerald-100 to-transparent dark:from-emerald-900/20",
  cyan: "from-cyan-100 to-transparent dark:from-cyan-900/20",
  blue: "from-blue-100 to-transparent dark:from-blue-900/20",
  indigo: "from-indigo-100 to-transparent dark:from-indigo-900/20",
};

export function ProCard({ icon, title, description, accent = "teal", className }: ProCardProps) {
  const accentGradient = accentMap[accent];
  const patternColor =
    accent === "teal"
      ? "text-teal-500"
      : accent === "emerald"
      ? "text-emerald-500"
      : accent === "cyan"
      ? "text-cyan-500"
      : accent === "blue"
      ? "text-blue-500"
      : "text-indigo-500";

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40",
        className
      )}
    >
      {/* Accent strip at top */}
      <div className={cn("absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-current", patternColor)} />

      {/* Side wave pattern (left, smaller, darker) */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-full w-16 opacity-100 transition-opacity duration-300 group-hover:opacity-100",
          patternColor
        )}
        style={{
          backgroundImage: [
            'url("/images/curves-waves.svg")',
            'linear-gradient(to bottom, var(--tw-gradient-stops))',
          ].join(', '),
          backgroundRepeat: 'repeat-y, no-repeat',
          backgroundSize: '64px 64px, auto',
          backgroundPosition: 'left top, 0 0',
        }}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-b", accentGradient)} />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        {icon && (
          <div className={cn("flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-current/10 text-2xl", patternColor)}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProCard;
