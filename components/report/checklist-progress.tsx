import { Check, AlertTriangle, Circle } from "lucide-react";
import type { ChecklistProgressProps } from "@/lib/report-types";

const statusConfig = {
  done: {
    icon: Check,
    iconClass: "text-white",
    bgClass: "bg-report-green",
  },
  partial: {
    icon: AlertTriangle,
    iconClass: "text-report-amber",
    bgClass: "bg-report-amber-bg",
  },
  pending: {
    icon: Circle,
    iconClass: "text-report-text-tertiary",
    bgClass: "bg-report-surface-alt",
  },
} as const;

function ProgressRing({ done, total }: { done: number; total: number }) {
  const size = 52;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = total > 0 ? done / total : 0;
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="shrink-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-report-surface-alt)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-report-green)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-[18px] font-bold tabular-nums text-report-text">
          {done}/{total}
        </span>
        <span className="text-[10px] font-medium text-report-text-tertiary">
          completed
        </span>
      </div>
    </div>
  );
}

export function ChecklistProgress({ items }: ChecklistProgressProps) {
  const doneCount = items.filter((item) => item.status === "done").length;
  const total = items.length;

  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      <div className="flex items-center gap-4 border-b border-report-border-light px-5 py-3.5">
        <ProgressRing done={doneCount} total={total} />
      </div>

      <div className="divide-y divide-report-border-light/60">
        {items.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-2.5">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${config.bgClass}`}>
                <Icon className={`h-3.5 w-3.5 ${config.iconClass}`} strokeWidth={2.5} />
              </div>
              <span className={`text-[13px] leading-snug ${
                item.status === "done" ? "text-report-text" : "text-report-text-secondary"
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
