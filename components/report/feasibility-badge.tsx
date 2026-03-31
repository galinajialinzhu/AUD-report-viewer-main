import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { FeasibilityBadgeProps } from "@/lib/report-types";

const config = {
  go: {
    icon: CheckCircle2,
    title: "Feasible — Strong Candidate",
    bg: "bg-report-green-bg",
    border: "border-report-green/20",
    iconColor: "text-report-green",
    accentBar: "bg-report-green",
    iconBg: "bg-report-green/10",
  },
  conditional: {
    icon: AlertTriangle,
    title: "Conditional — Review Required",
    bg: "bg-report-amber-bg",
    border: "border-report-amber/20",
    iconColor: "text-report-amber",
    accentBar: "bg-report-amber",
    iconBg: "bg-report-amber/10",
  },
  "no-go": {
    icon: XCircle,
    title: "Not Recommended",
    bg: "bg-report-red-bg",
    border: "border-report-red/20",
    iconColor: "text-report-red",
    accentBar: "bg-report-red",
    iconBg: "bg-report-red/10",
  },
} as const;

export function FeasibilityBadge({ status, summary }: FeasibilityBadgeProps) {
  const { icon: Icon, title, bg, border, iconColor, accentBar, iconBg } = config[status];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${bg} ${border} p-6`}>
      <div className={`absolute inset-x-0 top-0 h-1.5 ${accentBar}`} />
      {/* Decorative corner pattern */}
      <svg
        className="absolute right-0 top-0 h-24 w-24 opacity-[0.06]"
        viewBox="0 0 96 96"
        fill="none"
      >
        <circle cx="96" cy="0" r="64" stroke="currentColor" strokeWidth="2" />
        <circle cx="96" cy="0" r="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="96" cy="0" r="16" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-[20px] leading-tight text-report-text">
            {title}
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-report-text-secondary">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
