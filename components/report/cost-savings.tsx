import { CheckCircle2, Sparkles } from "lucide-react";
import type { CostSavingsProps } from "@/lib/report-types";

function formatCompact(value: number): string {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value.toLocaleString("en-US")}`;
}

const SEGMENT_COLORS = [
  "var(--color-report-green)",
  "var(--color-report-accent)",
  "var(--color-report-amber)",
  "var(--color-report-red)",
];

export function CostSavings({ items }: CostSavingsProps) {
  // Use midpoint of each item range for proportional donut
  const midpoints = items.map((item) => (item.low + item.high) / 2);
  const total = midpoints.reduce((sum, v) => sum + v, 0);

  const totalLow = items.reduce((sum, item) => sum + item.low, 0);
  const totalHigh = items.reduce((sum, item) => sum + item.high, 0);

  // Build SVG donut segments
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  const segments = midpoints.map((mid, i) => {
    const fraction = total > 0 ? mid / total : 0;
    const dashLen = fraction * circumference;
    const offset = circumference - accumulated;
    accumulated += dashLen;
    return {
      color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      dasharray: `${dashLen} ${circumference - dashLen}`,
      dashoffset: offset,
    };
  });

  return (
    <div className="rounded-xl border border-report-border-light bg-report-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 bg-report-surface-alt px-5 py-3 border-b border-report-border-light">
        <Sparkles className="h-4 w-4 text-report-accent" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-report-text-tertiary">
          Potential Cost Savings
        </span>
      </div>

      {/* Body: donut + list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
        {/* Left: SVG Donut */}
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 160 160" className="w-48 h-48">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--color-report-border-light)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                strokeLinecap="butt"
                transform="rotate(-90 80 80)"
                className="transition-all duration-500"
              />
            ))}
            {/* Center text */}
            <text
              x="80"
              y="74"
              textAnchor="middle"
              className="fill-report-text text-[11px] font-bold"
            >
              Total Savings
            </text>
            <text
              x="80"
              y="94"
              textAnchor="middle"
              className="fill-report-green text-[14px]"
              fontFamily="serif"
            >
              {formatCompact(totalLow)}–{formatCompact(totalHigh)}
            </text>
          </svg>
        </div>

        {/* Right: Savings items list */}
        <div className="flex flex-col divide-y divide-report-border-light">
          {items.map((item, i) => (
            <div key={item.name} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-report-text">
                  {item.name}
                </p>
                <p className="font-serif text-[14px] text-report-green">
                  {formatCompact(item.low)}–{formatCompact(item.high)}
                </p>
                <p className="text-[11px] text-report-text-tertiary leading-snug mt-0.5">
                  {item.condition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
