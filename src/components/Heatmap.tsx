import React from 'react';

type Cell = {
  value: number; // 0 to 1
  label?: string;
};

interface HeatmapProps {
  title?: string;
  rows?: number;
  cols?: number;
  data?: Cell[][]; // rows x cols; if omitted, generates sample data
}

export default function Heatmap({ title = 'Class Weakness Heatmap', rows = 6, cols = 10, data }: HeatmapProps) {
  const sample: Cell[][] = React.useMemo(() => {
    if (data) return data;
    // Deterministic sample data: gradient with some spikes
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const base = (r + c) / (rows + cols - 2);
        const spike = (r === 2 && c === 3) || (r === 4 && c === 7) ? 0.9 : 0;
        return { value: Math.min(1, base * 0.7 + spike) };
      })
    );
  }, [rows, cols, data]);

  function color(v: number) {
    // Green (good) -> Yellow -> Red (weakness). Invert for weaknesses if desired.
    const hue = 120 - Math.round(v * 120); // 120 -> 0
    const sat = 80;
    const light = 45 + Math.round((1 - v) * 10);
    return `hsl(${hue} ${sat}% ${light}%)`;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Low</span>
          <span className="h-3 w-12 rounded" style={{ background: 'linear-gradient(90deg, hsl(120 80% 50%), hsl(60 80% 50%), hsl(0 80% 50%))' }} />
          <span>High</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(16px, 1fr))`, gap: 4 }}>
          {sample.flatMap((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                title={`Cell ${r + 1}, ${c + 1}: ${(cell.value * 100).toFixed(0)}%`}
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-md shadow-sm"
                style={{ backgroundColor: color(cell.value) }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
