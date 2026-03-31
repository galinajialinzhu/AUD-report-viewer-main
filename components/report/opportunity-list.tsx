import { Lightbulb } from "lucide-react";
import type { OpportunityListProps } from "@/lib/report-types";

export function OpportunityList({ items }: OpportunityListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      {items.map((item, i) => (
        <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t border-report-border-light" : ""}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-report-green-bg">
            <Lightbulb className="h-4 w-4 text-report-green" />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-[13.5px] font-semibold leading-snug text-report-text">
              {item.title}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-report-text-secondary">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
