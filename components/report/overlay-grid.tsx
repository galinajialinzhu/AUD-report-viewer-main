"use client";

import { Children, isValidElement, useMemo, cloneElement } from "react";
import type { OverlayGridProps, OverlayBadgeProps, OverlayCornerColor } from "@/lib/report-types";
import { resolveIcon } from "@/lib/icon-map";
import { cardContainer, shadowCard, cn } from "@/lib/report-styles";

const COLS = 3;
const COLOR_OPTIONS: OverlayCornerColor[] = ["blue", "green", "purple", "amber", "yellow", "red"];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 为每行分配 3 种不重复的随机颜色 */
function buildCornerColors(count: number): OverlayCornerColor[] {
  const result: OverlayCornerColor[] = [];
  const numRows = Math.ceil(count / COLS);
  for (let r = 0; r < numRows; r++) {
    const rowColors = shuffle([...COLOR_OPTIONS]).slice(0, COLS);
    for (let c = 0; c < COLS && r * COLS + c < count; c++) {
      result.push(rowColors[c]);
    }
  }
  return result;
}

const statusStyles = {
  positive: {
    indicator: "bg-report-green",
    text: "text-report-green",
    iconBg: "bg-report-green-bg",
    shadow: shadowCard.green,
  },
  neutral: {
    indicator: "bg-report-amber",
    text: "text-report-amber",
    iconBg: "bg-report-amber-bg",
    shadow: shadowCard.yellow,
  },
  negative: {
    indicator: "bg-report-red",
    text: "text-report-red",
    iconBg: "bg-report-red-bg",
    shadow: shadowCard.red,
  },
} as const;

/* ---- Summary bar (counts across all items) ---- */
function OverlaySummaryBar({ children }: { children: React.ReactNode }) {
  let pos = 0,
    neu = 0,
    neg = 0;
  Children.forEach(children, (child) => {
    if (isValidElement<OverlayBadgeProps>(child) && child.props.status) {
      if (child.props.status === "positive") pos++;
      else if (child.props.status === "neutral") neu++;
      else neg++;
    }
  });
  const total = pos + neu + neg || 1;

  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-2 flex-1 overflow-hidden rounded-full">
        {pos > 0 && (
          <div
            className="bg-report-green"
            style={{ width: `${(pos / total) * 100}%` }}
          />
        )}
        {neu > 0 && (
          <div
            className="bg-report-amber"
            style={{ width: `${(neu / total) * 100}%` }}
          />
        )}
        {neg > 0 && (
          <div
            className="bg-report-red"
            style={{ width: `${(neg / total) * 100}%` }}
          />
        )}
      </div>
      <span className="shrink-0 text-[11px] font-medium text-report-text-secondary">
        {pos > 0 && <span className="text-report-green">{pos} Clear</span>}
        {pos > 0 && (neu > 0 || neg > 0) && " · "}
        {neu > 0 && <span className="text-report-amber">{neu} Note</span>}
        {neu > 0 && neg > 0 && " · "}
        {neg > 0 && <span className="text-report-red">{neg} Flag</span>}
      </span>
    </div>
  );
}

/* ---- Hero card for negative/flagged overlays ---- */
function FlaggedOverlayCard({
  icon,
  label,
  value,
}: OverlayBadgeProps) {
  const Icon = resolveIcon(icon);

  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-report-red-border bg-report-red-bg/40 px-5 py-3.5">
      <div className="absolute inset-y-0 left-0 w-1 bg-report-red" />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-report-red/10">
        {Icon ? (
          <Icon className="h-5 w-5 text-report-red" strokeWidth={2} />
        ) : (
          <span className="text-sm text-report-red">{icon}</span>
        )}
      </div>
      <p className="min-w-0 flex-1 text-[13.5px] font-bold text-report-text">
        {label}
      </p>
      <span className="shrink-0 rounded-full bg-report-red px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        {value}
      </span>
    </div>
  );
}

/* ---- Main grid: splits negative items into hero cards ---- */
export function OverlayGrid({ children }: OverlayGridProps) {
  const flagged: OverlayBadgeProps[] = [];
  const rest: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (
      isValidElement<OverlayBadgeProps>(child) &&
      child.props.status === "negative"
    ) {
      flagged.push(child.props);
    } else {
      rest.push(child);
    }
  });

  const cornerColors = useMemo(() => buildCornerColors(rest.length), [rest.length]);

  return (
    <div>
      {/* Hero cards for critical flags */}
      {flagged.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {flagged.map((item) => (
            <FlaggedOverlayCard key={item.label} {...item} />
          ))}
        </div>
      )}

      <OverlaySummaryBar>{children}</OverlaySummaryBar>

      {/* Remaining items in grid：右下角色彩随机分配，同行不重复 */}
      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {Children.map(rest, (child, i) =>
            isValidElement<OverlayBadgeProps>(child)
              ? cloneElement(child, { key: child.key ?? (child.props as OverlayBadgeProps).label, cornerColor: cornerColors[i] })
              : child
          )}
        </div>
      )}
    </div>
  );
}

/* 右下角/左上角色块用 6 色（与 cornerColor 一致） */
const cornerColorShadow: Record<OverlayCornerColor, string> = {
  blue: shadowCard.blue,
  green: shadowCard.green,
  purple: shadowCard.purple,
  amber: shadowCard.amber,
  yellow: shadowCard.yellow,
  red: shadowCard.red,
};

/* ---- Standard badge (positive / neutral) ---- */
export function OverlayBadge({
  icon,
  label,
  value,
  status,
  cornerColor,
}: OverlayBadgeProps) {
  const { indicator, text } = statusStyles[status];
  const Icon = resolveIcon(icon);

  // 右下角阴影：随机色（cornerColor）；左上角小点：始终按 status（Yes/No）颜色
  const shadowClass = cornerColor ? cornerColorShadow[cornerColor] : statusStyles[status].shadow;
  const dotClass = indicator;

  // 与 p1 一致：icon 浅蓝底 #E9F2FE + 蓝色描边 #2F68DE（线状图标）
  const iconWrapperClass = "mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-icon-fill)]";
  const iconClass = "h-4 w-4 text-[var(--color-icon-stroke)]";
  const iconProps = { strokeWidth: 2 };

  // Negative items are rendered as hero cards by OverlayGrid;
  // if somehow rendered standalone, fall back to compact style with red shadow.
  if (status === "negative") {
    return (
      <div
        className={cn(
          cardContainer.baseNoShadow,
          shadowClass,
          "relative flex flex-col items-start p-3 text-left min-h-[120px]"
        )}
      >
        <div className={cn("absolute left-3 top-3 h-2 w-2 rounded-full", dotClass)} />
        <div className={iconWrapperClass}>
          {Icon ? (
            <Icon className={iconClass} {...iconProps} />
          ) : (
            <span className="text-sm text-[var(--color-icon-stroke)]">{icon}</span>
          )}
        </div>
        <p className="text-[15px] font-medium text-report-text leading-tight">
          {label}
        </p>
        <p className={`mt-auto pt-2 text-[13px] font-semibold ${text}`}>{value}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        cardContainer.baseNoShadow,
        shadowClass,
        "relative flex flex-col items-start p-3 text-left min-h-[120px]"
      )}
    >
      <div className={cn("absolute left-3 top-3 h-2 w-2 rounded-full", dotClass)} />
      <div className={iconWrapperClass}>
        {Icon ? (
          <Icon className={iconClass} {...iconProps} />
        ) : (
          <span className="text-sm text-[var(--color-icon-stroke)]">{icon}</span>
        )}
      </div>
      <p className="text-[15px] font-medium text-report-text leading-tight">
        {label}
      </p>
      <p className={`mt-auto pt-2 text-[13px] font-semibold ${text}`}>{value}</p>
    </div>
  );
}
