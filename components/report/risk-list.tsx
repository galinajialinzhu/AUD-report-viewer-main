"use client";

import { useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
import type { RiskListProps, RiskItemData } from "@/lib/report-types";

const levelStyles = {
  high: {
    borderColor: "border-l-report-red",
    badgeBg: "bg-report-red-bg",
    badgeText: "text-report-red",
  },
  medium: {
    borderColor: "border-l-report-amber",
    badgeBg: "bg-report-amber-bg",
    badgeText: "text-report-amber",
  },
  low: {
    borderColor: "border-l-report-green",
    badgeBg: "bg-report-green-bg",
    badgeText: "text-report-green",
  },
} as const;

/* ---- HIGH risk: hero card, always expanded ---- */
function HighRiskHero({ item }: { item: RiskItemData }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-report-red-border bg-report-red-bg/30">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-report-red" />
      <div className="flex items-start gap-4 px-5 py-4 pl-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-report-red/10">
          <ShieldAlert className="h-5 w-5 text-report-red" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded-full bg-report-red px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              High Risk
            </span>
          </div>
          <p className="text-[15px] font-bold leading-snug text-report-text">
            {item.title}
          </p>
          <p className="mt-2 text-[13px] leading-[1.7] text-report-text-secondary">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- MEDIUM risk: collapsible card (current style) ---- */
function MediumRiskCard({
  item,
  expanded,
  onToggle,
}: {
  item: RiskItemData;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { borderColor, badgeBg, badgeText } = levelStyles.medium;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-report-border-light bg-report-surface ${borderColor} border-l-[3px]`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-report-surface-alt/30"
      >
        <span className="text-[13.5px] font-semibold text-report-text">
          {item.title}
        </span>
        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeBg} ${badgeText}`}
          >
            {item.level}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-report-text-tertiary transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-report-border-light px-5 py-4">
          <p className="text-[13px] leading-[1.7] text-report-text-secondary">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- LOW risk: compact collapsible group ---- */
function LowRiskGroup({ items }: { items: RiskItemData[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-report-surface-alt/30"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-report-green-bg">
            <span className="h-2 w-2 rounded-full bg-report-green" />
          </span>
          <span className="text-[12.5px] font-semibold text-report-text-secondary">
            {items.length} Low-Risk Items
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-report-text-tertiary transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-report-border-light px-5 py-3">
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-report-green" />
                <div>
                  <span className="text-[12.5px] font-medium text-report-text">
                    {item.title}
                  </span>
                  <span className="ml-1 text-[12px] text-report-text-tertiary">
                    — {item.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---- Severity summary bar ---- */
function SeveritySummary({ items }: { items: RiskItemData[] }) {
  const high = items.filter((i) => i.level === "high").length;
  const medium = items.filter((i) => i.level === "medium").length;
  const low = items.filter((i) => i.level === "low").length;
  const total = items.length || 1;

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-report-border-light bg-report-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
          Risk Distribution
        </span>
        <span className="text-[11px] font-medium text-report-text-secondary">
          {high > 0 && <span className="text-report-red">{high} High</span>}
          {high > 0 && medium > 0 && " / "}
          {medium > 0 && (
            <span className="text-report-amber">{medium} Medium</span>
          )}
          {(high > 0 || medium > 0) && low > 0 && " / "}
          {low > 0 && <span className="text-report-green">{low} Low</span>}
        </span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full">
        {high > 0 && (
          <div
            className="bg-report-red"
            style={{ width: `${(high / total) * 100}%` }}
          />
        )}
        {medium > 0 && (
          <div
            className="bg-report-amber"
            style={{ width: `${(medium / total) * 100}%` }}
          />
        )}
        {low > 0 && (
          <div
            className="bg-report-green"
            style={{ width: `${(low / total) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Main RiskList with tiered rendering ---- */
export function RiskList({ items }: RiskListProps) {
  const highItems = items.filter((i) => i.level === "high");
  const mediumItems = items.filter((i) => i.level === "medium");
  const lowItems = items.filter((i) => i.level === "low");

  const [expandedMedium, setExpandedMedium] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <SeveritySummary items={items} />

      {/* HIGH — hero cards, always expanded */}
      {highItems.map((item) => (
        <HighRiskHero key={item.title} item={item} />
      ))}

      {/* MEDIUM — standard collapsible cards */}
      {mediumItems.map((item, i) => (
        <MediumRiskCard
          key={item.title}
          item={item}
          expanded={expandedMedium === i}
          onToggle={() =>
            setExpandedMedium((prev) => (prev === i ? null : i))
          }
        />
      ))}

      {/* LOW — compact group */}
      {lowItems.length > 0 && <LowRiskGroup items={lowItems} />}
    </div>
  );
}
