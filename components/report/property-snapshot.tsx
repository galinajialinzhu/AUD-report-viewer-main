"use client";

import type { PropertySnapshotProps } from "@/lib/report-types";
import { resolveIcon } from "@/lib/icon-map";
import { cn } from "@/lib/report-styles";

/** 根据 label 默认映射到 icon（与 icon-map 一致） */
const LABEL_ICON_MAP: Record<string, string> = {
  Zoning: "landmark",
  Jurisdiction: "building",
  APN: "file-text",
  "Lot Size": "ruler",
  "Existing Use": "home",
  Garage: "truck",
  Electrical: "zap",
  "Estimated Value": "circle-dollar-sign",
  Schools: "book-open",
  "Overlays / Hazards": "triangle-alert",
  "Property Type": "users",
  "Access Type": "train",
  "Backyard Area": "home",
  "Existing Structures": "building",
};

export function PropertySnapshot({ fields }: PropertySnapshotProps) {
  const detailFields = fields.slice(1);

  // Pre-compute which span-1 fields are alone in their row
  const spans: number[] = [];
  let col = 0;
  for (let i = 0; i < detailFields.length; i++) {
    const f = detailFields[i];
    if (f.span === 2) {
      if (col === 1) spans[i - 1] = 2;
      spans[i] = 2;
      col = 0;
    } else {
      spans[i] = 1;
      col++;
      if (col === 2) col = 0;
    }
  }
  if (col === 1) spans[detailFields.length - 1] = 2;

  return (
    <div className="mt-6 mb-2">
      {/* Your Property Details 风格：浅色卡片、圆角、轻边框 */}
      {fields.length > 0 && (
        <div className="relative mb-5 overflow-hidden rounded-xl border border-report-border-light bg-report-fill p-6 shadow-[7px_7px_0_var(--shadow-report-blue)]">
          <h2 className="font-sans text-[20px] font-bold text-report-text">
            Your Property Details
          </h2>
          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-icon-fill)]">
              {(() => {
                const Icon = resolveIcon("map-pin");
                return Icon ? (
                  <Icon
                    className="h-4 w-4 text-[var(--color-icon-stroke)]"
                    strokeWidth={2}
                  />
                ) : null;
              })()}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-report-text-tertiary">
                Address
              </p>
              <p className="mt-1 font-sans text-[16px] font-medium leading-snug text-report-text">
                {fields[0].value}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Site Specifications：icon + label + value，宽松间距 */}
      <div className="rounded-xl border border-report-border-light bg-report-fill overflow-hidden">
        <div className="border-b border-report-border-light px-5 py-3">
          <h3 className="font-sans text-[14px] font-bold text-report-text">
            Site Specifications
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 p-5">
          {detailFields.map((field, i) => {
            const iconName = field.icon ?? LABEL_ICON_MAP[field.label] ?? "file-text";
            const Icon = resolveIcon(iconName);
            return (
              <div
                key={field.label}
                className={cn(
                  "flex items-start gap-3",
                  spans[i] === 2 && "col-span-2"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-report-surface-alt">
                  {Icon ? (
                    <Icon
                      className="h-4 w-4 text-report-text-secondary"
                      strokeWidth={2}
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-normal text-report-text-tertiary">
                    {field.label}
                  </p>
                  <p className="mt-0.5 font-sans text-[13px] font-medium leading-snug text-report-text">
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
