import type { CostBreakdownProps } from "@/lib/report-types";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function formatCompact(value: number): string {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value}`;
}

interface CategoryGroup {
  label: string;
  low: number;
  high: number;
  barColor: string;
  barBg: string;
  svgColor: string;
}

function groupByCategory(
  items: Array<{ name: string; low: number; high: number }>
): CategoryGroup[] {
  const keywords: Array<[string, string[], string, string, string]> = [
    ["Permits & Fees", ["permit", "plan check", "zoning", "school", "impact", "metro", "sewer capacity", "lasan", "lid", "public works", "conservation fee", "hcp"], "bg-report-accent", "bg-report-accent/20", "var(--color-report-accent)"],
    ["Professional Services", ["architect", "structural", "geotech", "geolog", "title 24", "energy model", "survey", "utility consult", "electrical load", "expedit", "engineering"], "bg-report-green", "bg-report-green/20", "var(--color-report-green)"],
    ["Site & Foundation", ["demolition", "site prep", "foundation", "concrete", "grading", "alquist", "utility trench", "easement", "excavat", "sewer lateral", "trenching"], "bg-report-amber", "bg-report-amber/20", "var(--color-report-amber)"],
    ["Construction", ["framing", "roofing", "exterior", "siding", "window", "door", "plumbing", "electrical", "hvac", "interior", "kitchen", "bathroom", "closet", "lighting", "hardware", "solar", "walkway", "patio", "landscape", "construction", "build", "panel upgrade", "utility connection"], "bg-report-purple", "bg-report-purple/20", "var(--color-report-purple)"],
  ];

  const groups = new Map<string, { low: number; high: number; barColor: string; barBg: string; svgColor: string }>();
  for (const [label, , barColor, barBg, svgColor] of keywords) groups.set(label, { low: 0, high: 0, barColor, barBg, svgColor });
  groups.set("Other", { low: 0, high: 0, barColor: "bg-report-text-tertiary", barBg: "bg-report-text-tertiary/20", svgColor: "#9CA3AF" });

  for (const item of items) {
    const nameLower = item.name.toLowerCase();
    let matched = false;
    for (const [label, kws] of keywords) {
      if (kws.some((kw) => nameLower.includes(kw))) {
        const g = groups.get(label)!;
        g.low += item.low;
        g.high += item.high;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const g = groups.get("Other")!;
      g.low += item.low;
      g.high += item.high;
    }
  }

  const result: CategoryGroup[] = [];
  for (const [label] of keywords) {
    const g = groups.get(label)!;
    if (g.low > 0 || g.high > 0) result.push({ label, ...g });
  }
  const other = groups.get("Other")!;
  if (other.low > 0 || other.high > 0) result.push({ label: "Other", ...other });
  return result;
}

export function CostBreakdown({
  title,
  items,
  contingencyPercent,
}: CostBreakdownProps) {
  const subtotalLow = items.reduce((sum, item) => sum + item.low, 0);
  const subtotalHigh = items.reduce((sum, item) => sum + item.high, 0);
  const contingencyLow = Math.round(subtotalLow * (contingencyPercent / 100));
  const contingencyHigh = Math.round(subtotalHigh * (contingencyPercent / 100));
  const totalLow = subtotalLow + contingencyLow;
  const totalHigh = subtotalHigh + contingencyHigh;

  const categories = groupByCategory(items);
  const maxHigh = Math.max(...categories.map((c) => c.high), 1);

  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light">
      <div className="border-b border-report-border-light bg-report-surface-alt px-5 py-3.5">
        <h3 className="text-[14px] font-bold text-report-text">{title}</h3>
      </div>

      {/* Quick total glance */}
      <div className="flex items-center gap-4 border-b border-report-border-light bg-report-surface-alt/50 px-5 py-3">
        <div className="flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">Estimated Range</p>
          <p className="mt-0.5 font-serif text-[20px] text-report-accent">
            {formatCompact(totalLow)}–{formatCompact(totalHigh)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">{items.length} Line Items</p>
          <p className="mt-0.5 text-[11px] text-report-text-secondary">
            +{contingencyPercent}% contingency included
          </p>
        </div>
      </div>

      {/* Visual cost category bars + donut */}
      <div className="border-b border-report-border-light bg-report-surface px-5 py-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
          Cost Distribution by Category
        </p>
        <div className="flex flex-col md:flex-row gap-5 items-center">
          {/* Donut chart */}
          {(() => {
            const midpoints = categories.map((c) => (c.low + c.high) / 2);
            const donutTotal = midpoints.reduce((s, v) => s + v, 0);
            const radius = 52;
            const strokeWidth = 16;
            const circumference = 2 * Math.PI * radius;
            let acc = 0;
            const segs = midpoints.map((mid, i) => {
              const fraction = donutTotal > 0 ? mid / donutTotal : 0;
              const dashLen = fraction * circumference;
              const offset = circumference - acc;
              acc += dashLen;
              return { color: categories[i].svgColor, dasharray: `${dashLen} ${circumference - dashLen}`, dashoffset: offset, pct: Math.round(fraction * 100) };
            });
            return (
              <div className="shrink-0">
                <svg viewBox="0 0 140 140" className="w-36 h-36">
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-report-border-light)" strokeWidth={strokeWidth} />
                  {segs.map((seg, i) => (
                    <circle
                      key={i}
                      cx="70" cy="70" r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={seg.dasharray}
                      strokeDashoffset={seg.dashoffset}
                      strokeLinecap="butt"
                      transform="rotate(-90 70 70)"
                      className="transition-all duration-500"
                    />
                  ))}
                  <text x="70" y="65" textAnchor="middle" className="fill-report-text-tertiary text-[8px] font-bold">
                    TOTAL
                  </text>
                  <text x="70" y="80" textAnchor="middle" className="fill-report-text text-[11px]" fontFamily="serif">
                    {formatCompact(totalLow)}–{formatCompact(totalHigh)}
                  </text>
                </svg>
              </div>
            );
          })()}
          {/* Bar chart */}
          <div className="flex-1 flex flex-col gap-2.5 w-full">
            {categories.map((cat) => {
              const lowPct = (cat.low / maxHigh) * 100;
              const highPct = (cat.high / maxHigh) * 100;
              return (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="w-[120px] shrink-0 text-[11px] font-medium text-report-text-secondary">
                    {cat.label}
                  </span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded bg-report-surface-alt">
                    <div
                      className={`absolute inset-y-0 left-0 rounded ${cat.barBg}`}
                      style={{ width: `${highPct}%` }}
                    />
                    <div
                      className={`absolute inset-y-0 left-0 rounded ${cat.barColor}`}
                      style={{ width: `${lowPct}%` }}
                    />
                  </div>
                  <span className="w-[110px] shrink-0 text-right font-mono text-[10.5px] tabular-nums text-report-text-secondary">
                    {formatCompact(cat.low)}–{formatCompact(cat.high)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b-2 border-report-border bg-report-surface-alt/50">
              <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
                Item
              </th>
              <th className="w-[90px] px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
                Low Est.
              </th>
              <th className="w-[90px] px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
                High Est.
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                className={`border-b border-report-border-light/60 ${
                  i % 2 === 1 ? "bg-report-surface-alt/30" : "bg-report-surface"
                }`}
              >
                <td className="px-5 py-2 text-report-text">{item.name}</td>
                <td className="px-4 py-2 text-right font-mono text-[11.5px] tabular-nums text-report-text-secondary">
                  {formatCurrency(item.low)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-[11.5px] tabular-nums text-report-text-secondary">
                  {formatCurrency(item.high)}
                </td>
                <td className="px-4 py-2 text-[11.5px] text-report-text-tertiary">
                  {item.note ?? ""}
                </td>
              </tr>
            ))}

            {/* Subtotal */}
            <tr className="border-t-2 border-report-border bg-report-surface-alt">
              <td className="px-5 py-2.5 font-bold text-report-text">Subtotal</td>
              <td className="px-4 py-2.5 text-right font-mono text-[11.5px] tabular-nums font-bold text-report-text">
                {formatCurrency(subtotalLow)}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-[11.5px] tabular-nums font-bold text-report-text">
                {formatCurrency(subtotalHigh)}
              </td>
              <td className="px-4 py-2.5" />
            </tr>

            {/* Contingency */}
            <tr className="bg-report-amber-bg/50">
              <td className="px-5 py-2.5 font-medium text-report-amber">
                Contingency ({contingencyPercent}%)
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-[11.5px] tabular-nums text-report-amber">
                {formatCurrency(contingencyLow)}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-[11.5px] tabular-nums text-report-amber">
                {formatCurrency(contingencyHigh)}
              </td>
              <td className="px-4 py-2.5" />
            </tr>

            {/* Total */}
            <tr className="bg-report-accent">
              <td className="px-5 py-3 text-[13px] font-bold uppercase tracking-wider text-white">
                Total
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] font-bold tabular-nums text-white">
                {formatCurrency(totalLow)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] font-bold tabular-nums text-white">
                {formatCurrency(totalHigh)}
              </td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
