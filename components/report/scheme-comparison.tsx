import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Trophy, ShieldAlert, Shield, Target, ChevronDown } from "lucide-react";
import type { SchemeComparisonProps } from "@/lib/report-types";
import { cn } from "@/lib/report-styles";

// --- Radar chart helpers ---

const SCHEME_COLORS = [
  "var(--color-report-accent)",
  "var(--color-report-green)",
  "var(--color-report-amber)",
  "#8B5CF6",
  "#14B8A6",
];

const RADAR_AXES = ["Cost", "Size", "Timeline", "Risk", "Rent"] as const;

/** Parse dollar amounts from costRange, preferring the last pair (typically the all-in figure) */
function parseCostMidpoint(costRange: string): number {
  const matches = costRange.match(/\$[\d,.]+[kK]?/g);
  if (!matches || matches.length === 0) return 0;
  const parse = (s: string) => {
    const n = parseFloat(s.replace(/[$,]/g, ""));
    return /[kK]/.test(s) ? n * 1000 : n;
  };
  const values = matches.map(parse);
  // Use the last 2 values (all-in estimate) if there are 4+, otherwise average all
  const tail = values.length >= 4 ? values.slice(-2) : values;
  return tail.reduce((a, b) => a + b, 0) / tail.length;
}

/** Parse square footage from specs value like "≈400–600 sf" */
function parseSizeMidpoint(specs: Array<{ label: string; value: string }>): number {
  const sizeSpec = specs.find((s) => s.label.toLowerCase().includes("size"));
  if (!sizeSpec) return 0;
  const nums = sizeSpec.value.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseFloat(n.replace(/,/g, "")));
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Parse timeline months from a costRange/description context — use heuristic from data */
function parseTimelineMonths(scheme: { costRange: string; description: string; specs: Array<{ label: string; value: string }> }): number {
  // Look for patterns like "6–8 months" or "8-12 months" in description or specs
  const text = `${scheme.description} ${scheme.specs.map((s) => s.value).join(" ")}`;
  const match = text.match(/(\d+)\s*[–-]\s*(\d+)\s*(?:mo|month)/i);
  if (match) return (parseInt(match[1]) + parseInt(match[2])) / 2;
  // Fallback: estimate from cost — higher cost → longer timeline
  const cost = parseCostMidpoint(scheme.costRange);
  if (cost < 300000) return 7;
  if (cost < 400000) return 10;
  return 14;
}

/** Estimate monthly rent from description or cost tier */
function parseRentEstimate(scheme: { description: string; costRange: string }): number {
  const match = scheme.description.match(/\$[\d,]+\s*[–-]\s*\$?([\d,]+)\+?\s*(?:\/?\s*mo|per\s*month|in\s*market)?/i);
  if (match) {
    const nums = scheme.description.match(/\$([\d,]+)/g);
    if (nums && nums.length >= 2) {
      const vals = nums.map((n) => parseFloat(n.replace(/[$,]/g, "")));
      // Filter to rent-range values (typically $1000-$5000)
      const rentVals = vals.filter((v) => v >= 800 && v <= 6000);
      if (rentVals.length >= 2) return (rentVals[0] + rentVals[1]) / 2;
    }
  }
  // Fallback heuristic by cost tier
  const cost = parseCostMidpoint(scheme.costRange);
  if (cost < 300000) return 1800;
  if (cost < 400000) return 2400;
  return 2600;
}

const riskScore: Record<string, number> = { low: 1, medium: 2, high: 3 };

/** Safe number: replace NaN/undefined with fallback */
function safeNum(val: number | undefined, fallback: number): number {
  return val != null && !isNaN(val) ? val : fallback;
}

interface RadarScores {
  cost: number;
  size: number;
  timeline: number;
  risk: number;
  rent: number;
}

function computeRadarScores(
  schemes: SchemeComparisonProps["schemes"]
): Array<{ name: string; scores: number[] }> {
  const raw: Array<{ name: string; raw: RadarScores }> = schemes.map((s) => ({
    name: s.name,
    raw: {
      cost: safeNum(parseCostMidpoint(s.costRange), 200000),
      size: safeNum(parseSizeMidpoint(s.specs), 600),
      timeline: safeNum(parseTimelineMonths(s), 9),
      risk: safeNum(riskScore[s.riskLevel ?? "medium"], 2),
      rent: safeNum(parseRentEstimate(s), 2000),
    },
  }));

  // Normalize each axis to 0-1. For cost, timeline, risk: INVERT (lower = better = higher score)
  const axes: (keyof RadarScores)[] = ["cost", "size", "timeline", "risk", "rent"];
  const inverted = new Set<keyof RadarScores>(["cost", "timeline", "risk"]);

  const result = raw.map((item) => {
    const scores = axes.map((axis) => {
      const values = raw.map((r) => r.raw[axis]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 1;
      const normalized = (item.raw[axis] - min) / range;
      // Invert axes where lower is better, then shift to 0.2-1.0 range for visibility
      const directed = inverted.has(axis) ? 1 - normalized : normalized;
      return 0.2 + directed * 0.8;
    });
    return { name: item.name, scores };
  });

  return result;
}

function RadarChart({ schemes }: SchemeComparisonProps) {
  const data = computeRadarScores(schemes);
  if (data.length === 0) return null;

  const cx = 140;
  const cy = 130;
  const maxR = 90;
  const levels = 4;

  // Compute angle for each axis (start from top, go clockwise)
  const angleStep = (2 * Math.PI) / RADAR_AXES.length;
  const angleFor = (i: number) => -Math.PI / 2 + i * angleStep;

  const pointAt = (axisIdx: number, value: number) => {
    const a = angleFor(axisIdx);
    return { x: cx + Math.cos(a) * maxR * value, y: cy + Math.sin(a) * maxR * value };
  };

  const polygonPoints = (scores: number[]) =>
    scores.map((v, i) => {
      const p = pointAt(i, v);
      return `${p.x},${p.y}`;
    }).join(" ");

  return (
    <div className="rounded-xl border border-report-border-light bg-report-surface overflow-hidden mb-4">
      <div className="flex items-center gap-2 bg-report-surface-alt px-5 py-3 border-b border-report-border-light">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-report-text-tertiary">
          Scheme Comparison Overview
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 p-5">
        <svg viewBox="0 0 280 260" className="w-full max-w-[320px] h-auto">
          {/* Grid rings */}
          {Array.from({ length: levels }, (_, li) => {
            const r = ((li + 1) / levels);
            const pts = RADAR_AXES.map((_, i) => {
              const p = pointAt(i, r);
              return `${p.x},${p.y}`;
            }).join(" ");
            return (
              <polygon
                key={li}
                points={pts}
                fill="none"
                stroke="var(--color-report-border-light)"
                strokeWidth="0.75"
                strokeDasharray={li < levels - 1 ? "3 3" : "none"}
              />
            );
          })}

          {/* Axis lines */}
          {RADAR_AXES.map((_, i) => {
            const p = pointAt(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="var(--color-report-border-light)"
                strokeWidth="0.75"
              />
            );
          })}

          {/* Scheme polygons */}
          {data.map((d, di) => (
            <polygon
              key={di}
              points={polygonPoints(d.scores)}
              fill={SCHEME_COLORS[di % SCHEME_COLORS.length]}
              fillOpacity={0.12}
              stroke={SCHEME_COLORS[di % SCHEME_COLORS.length]}
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
          ))}

          {/* Vertex dots for each scheme */}
          {data.map((d, di) =>
            d.scores.map((v, ai) => {
              const p = pointAt(ai, v);
              return (
                <circle
                  key={`${di}-${ai}`}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill={SCHEME_COLORS[di % SCHEME_COLORS.length]}
                />
              );
            })
          )}

          {/* Axis labels */}
          {RADAR_AXES.map((label, i) => {
            const p = pointAt(i, 1.18);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-report-text-secondary text-[10px] font-semibold"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {data.map((d, di) => {
            // Shorten label: "Scheme A: Convert & Expand..." → "Scheme A: Convert & Expand..."
            const colonIdx = d.name.indexOf(":");
            const shortName = colonIdx > -1
              ? (d.name.slice(0, colonIdx + 1) + " " + d.name.slice(colonIdx + 1).split("(")[0].trim()).slice(0, 42)
              : d.name.slice(0, 42);
            return (
              <div key={di} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm shrink-0"
                  style={{ backgroundColor: SCHEME_COLORS[di % SCHEME_COLORS.length] }}
                />
                <span className="text-[11px] text-report-text-secondary leading-tight">
                  {shortName}
                </span>
              </div>
            );
          })}
          <p className="text-[9px] text-report-text-tertiary mt-1 max-w-[200px] leading-snug">
            Higher values = more favorable. Cost, timeline, and risk are inverted so that lower costs/risk score higher.
          </p>
        </div>
      </div>
    </div>
  );
}

const riskConfig = {
  high: {
    icon: ShieldAlert,
    label: "High Risk",
    bg: "bg-report-red/10",
    border: "border-report-red/20",
    text: "text-report-red",
  },
  medium: {
    icon: AlertTriangle,
    label: "Medium Risk",
    bg: "bg-report-amber/10",
    border: "border-report-amber/20",
    text: "text-report-amber",
  },
  low: {
    icon: Shield,
    label: "Low Risk",
    bg: "bg-report-green/10",
    border: "border-report-green/20",
    text: "text-report-green",
  },
} as const;

export function SchemeComparison({ schemes }: SchemeComparisonProps) {
  const defaultSelected = useMemo(() => {
    const rec = schemes.find((s) => s.recommended);
    return rec?.name ?? schemes[0]?.name ?? "";
  }, [schemes]);

  const [selected, setSelected] = useState(defaultSelected);
  const selectedScheme = useMemo(
    () => schemes.find((s) => s.name === selected) ?? schemes[0],
    [schemes, selected]
  );

  const topCards = schemes;

  return (
    <div className="space-y-4">
      {/* Top horizontal scheme cards (tap to expand details below) */}
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {topCards.map((scheme) => {
          const isActive = scheme.name === selected;
          const timelineSpec = scheme.specs.find((s) => s.label.toLowerCase().includes("timeline"))?.value;
          const sizeSpec = scheme.specs.find((s) => s.label.toLowerCase().includes("size"))?.value;
          return (
            <button
              key={scheme.name}
              type="button"
              onClick={() => setSelected(scheme.name)}
              className={cn(
                "relative min-w-[260px] max-w-[320px] flex-1 overflow-hidden rounded-xl border bg-report-fill text-left transition-colors",
                isActive ? "border-[#2F68DE] ring-2 ring-[#2F68DE]/15" : "border-report-stroke hover:border-[#2F68DE]/60"
              )}
            >
              {scheme.recommended && (
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#2F68DE] px-2 py-1">
                  <Trophy className="h-3 w-3 text-white/90" />
                  <span className="text-[10px] font-bold tracking-wide text-white">Recommended</span>
                </div>
              )}
              <div className="p-4">
                <p className="font-serif text-[14px] font-bold text-report-text leading-snug pr-16">
                  {scheme.name}
                </p>
                <p className="mt-2 font-sans text-[18px] font-bold text-report-text">
                  {scheme.costRange}
                </p>
                <div className="mt-2 text-[11px] text-report-text-tertiary space-y-1">
                  {timelineSpec && <div>Timeline · {timelineSpec}</div>}
                  {sizeSpec && <div>{sizeSpec}</div>}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F68DE]">
                  <span>{isActive ? "Showing details" : "Select to expand"}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isActive ? "rotate-180" : "")} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded details for selected scheme */}
      {selectedScheme && (
        <div className="rounded-xl border border-[#2F68DE]/20 bg-[#F0F6FF] overflow-hidden">
          <div className="flex items-center justify-between gap-3 bg-white/40 px-5 py-3 border-b border-[#2F68DE]/15">
            <p className="font-serif text-[16px] font-bold text-report-text">
              {selectedScheme.name}
            </p>
            <span className="text-[12px] font-semibold text-[#2F68DE]">
              {selectedScheme.costRange}
            </span>
          </div>

          <div className="p-5">
            <p className="text-[13px] leading-relaxed text-report-text-secondary">
              {selectedScheme.description}
            </p>

            {selectedScheme.specs.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-lg border border-[#2F68DE]/15 bg-[#2F68DE]/10">
                {selectedScheme.specs.map((spec) => (
                  <div key={spec.label} className="bg-white/50 px-3 py-2.5 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-report-text-tertiary">
                      {spec.label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold text-report-text">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedScheme.riskLevel && (() => {
              const cfg = riskConfig[selectedScheme.riskLevel];
              const Icon = cfg.icon;
              return (
                <div className={cn("inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full border", cfg.bg, cfg.border)}>
                  <Icon className={cn("h-3 w-3", cfg.text)} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-[0.1em]", cfg.text)}>
                    {cfg.label}
                  </span>
                </div>
              );
            })()}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedScheme.pros.length > 0 && (
                <div className="rounded-xl border border-[#2F68DE]/15 bg-white/50 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2F68DE]">
                    Key Advantages
                  </p>
                  <ul className="space-y-1.5">
                    {selectedScheme.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F68DE]" />
                        <span className="text-report-text-secondary">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScheme.cons.length > 0 && (
                <div className="rounded-xl border border-[#2F68DE]/15 bg-white/50 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-report-text-tertiary">
                    Considerations
                  </p>
                  <ul className="space-y-1.5">
                    {selectedScheme.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px]">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-report-amber" />
                        <span className="text-report-text-secondary">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {selectedScheme.bestFor && (
              <div className="mt-4 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[#2F68DE]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">Best For</span>
                <span className="text-[12px] text-report-text-secondary">{selectedScheme.bestFor}</span>
              </div>
            )}

            {schemes.length > 1 && (
              <div className="mt-5">
                <RadarChart schemes={schemes} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
