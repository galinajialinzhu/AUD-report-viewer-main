import {
  ShieldAlert,
  CircleDollarSign,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { KeyAlertsProps } from "@/lib/report-types";

interface AlertConfig {
  icon: LucideIcon;
  bg: string;
  accentBar: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
}

const alertConfig: Record<string, AlertConfig> = {
  danger: {
    icon: ShieldAlert,
    bg: "bg-report-red-bg/50",
    accentBar: "bg-report-red",
    iconBg: "bg-report-red/10",
    iconColor: "text-report-red",
    badgeBg: "bg-report-red",
    badgeText: "text-white",
    badgeLabel: "Critical",
  },
  cost: {
    icon: CircleDollarSign,
    bg: "bg-report-amber-bg/50",
    accentBar: "bg-report-amber",
    iconBg: "bg-report-amber/10",
    iconColor: "text-report-amber",
    badgeBg: "bg-report-amber-bg",
    badgeText: "text-report-amber",
    badgeLabel: "Cost Alert",
  },
  advantage: {
    icon: CheckCircle2,
    bg: "bg-report-green-bg/50",
    accentBar: "bg-report-green",
    iconBg: "bg-report-green/10",
    iconColor: "text-report-green",
    badgeBg: "bg-report-green-bg",
    badgeText: "text-report-green",
    badgeLabel: "Advantage",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-report-accent-light",
    accentBar: "bg-report-accent",
    iconBg: "bg-report-accent/10",
    iconColor: "text-report-accent",
    badgeBg: "bg-report-accent/10",
    badgeText: "text-report-accent",
    badgeLabel: "Strategy",
  },
  financial: {
    icon: TrendingUp,
    bg: "bg-report-accent-light",
    accentBar: "bg-report-accent",
    iconBg: "bg-report-accent/10",
    iconColor: "text-report-accent",
    badgeBg: "bg-report-accent/10",
    badgeText: "text-report-accent",
    badgeLabel: "Financial",
  },
};

export function KeyAlerts({ alerts }: KeyAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light">
      <div className="border-b border-report-border-light bg-report-surface-alt px-5 py-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-report-accent" strokeWidth={2.5} />
          <h3 className="text-[13px] font-bold tracking-[-0.01em] text-report-text">
            Key Property Alerts
          </h3>
          <span className="ml-auto rounded-full bg-report-accent/10 px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-report-accent">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {alerts.map((alert, i) => {
          const config = alertConfig[alert.type] ?? alertConfig.tip;
          const Icon = config.icon;
          const isDanger = alert.type === "danger";

          return (
            <div
              key={i}
              className={`relative flex items-start gap-3.5 border-b border-report-border-light/60 last:border-b-0 ${config.bg} ${isDanger ? "px-5 py-4" : "px-5 py-3"}`}
            >
              <div
                className={`absolute inset-y-0 left-0 ${isDanger ? "w-1.5" : "w-1"} ${config.accentBar}`}
              />
              <div
                className={`flex shrink-0 items-center justify-center rounded-lg ${config.iconBg} ${isDanger ? "h-9 w-9" : "h-7 w-7"}`}
              >
                <Icon
                  className={`${isDanger ? "h-5 w-5" : "h-3.5 w-3.5"} ${config.iconColor}`}
                  strokeWidth={2}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] ${config.badgeBg} ${config.badgeText}`}
                  >
                    {config.badgeLabel}
                  </span>
                </div>
                <p
                  className={`font-semibold text-report-text ${isDanger ? "text-[14px]" : "text-[13px]"}`}
                >
                  {alert.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.6] text-report-text-secondary">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
