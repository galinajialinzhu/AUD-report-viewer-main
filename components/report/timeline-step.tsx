"use client";

import { Check } from "lucide-react";
import type { TimelineStepProps } from "@/lib/report-types";
import { resolveIcon } from "@/lib/icon-map";

const STEP_ICONS = ["search", "lightbulb", "file-text", "clipboard-check", "clock", "home"] as const;

function getStepIcon(step: number | string, iconProp?: string): string {
  if (iconProp) return iconProp;
  const n = typeof step === "number" ? step : parseInt(String(step), 10);
  return Number.isFinite(n) && n >= 1 && n <= STEP_ICONS.length
    ? STEP_ICONS[n - 1]
    : "file-text";
}

export function TimelineStep({
  step,
  title,
  duration,
  icon: iconProp,
  children,
}: TimelineStepProps) {
  const isCompleted = duration?.toLowerCase() === "completed";
  const iconName = getStepIcon(step, iconProp);
  const IconComponent = resolveIcon(iconName);

  return (
    <div className="group relative flex gap-4 pb-1">
      {/* 左侧：蓝色竖线 + 圆形图标 */}
      <div className="relative flex flex-col items-center">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2F68DE] bg-[#E9F2FE] text-[#2F68DE]"
          aria-hidden
        >
          {isCompleted ? (
            <Check className="h-5 w-5" strokeWidth={2.5} />
          ) : IconComponent ? (
            <IconComponent className="h-5 w-5" strokeWidth={2} />
          ) : (
            <span className="font-mono text-[13px] font-bold">{step}</span>
          )}
        </div>
        <div
          className="absolute left-[19px] top-[44px] bottom-0 w-0.5 min-h-[8px] group-last:hidden bg-[#2F68DE]/25"
          aria-hidden
        />
      </div>

      {/* 右侧：标题 + 时长（蓝色）+ 内容卡片（浅蓝底） */}
      <div className="mb-5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[14px] font-semibold text-report-text">{title}</p>
          {duration && (
            <span className="shrink-0 text-[12px] font-semibold text-[#2F68DE]">
              {duration}
            </span>
          )}
        </div>
        <div className="mt-2 rounded-xl border border-[#2F68DE]/20 bg-[#F0F6FF] p-4">
          <div className="text-[13px] leading-[1.7] text-report-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
