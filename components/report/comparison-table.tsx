import { Star } from "lucide-react";
import type { ComparisonTableProps } from "@/lib/report-types";

export function ComparisonTable({
  headers,
  rows,
  highlightColumn,
}: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b-2 border-report-border bg-report-surface-alt">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.1em] ${
                    i === 0 ? "w-[120px] min-w-[120px] text-report-text-tertiary" : ""
                  } ${
                    highlightColumn === i
                      ? "bg-report-accent-light text-report-accent"
                      : i > 0
                        ? "text-report-text"
                        : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {highlightColumn === i && (
                      <Star className="h-3 w-3 fill-report-accent text-report-accent" />
                    )}
                    {header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-report-border-light last:border-b-0 ${
                  rowIdx % 2 === 0 ? "bg-report-surface" : "bg-report-surface-alt/30"
                }`}
              >
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 align-top leading-[1.6] text-report-text-secondary ${
                      colIdx === 0 ? "font-semibold text-report-text" : ""
                    } ${
                      highlightColumn === colIdx
                        ? "bg-report-accent-light/40 font-medium text-report-text"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
