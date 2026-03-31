import type { CitationRefProps } from "@/lib/report-types";

export function CitationRef({ id }: CitationRefProps) {
  return (
    <sup className="cursor-pointer text-[10px] font-semibold text-report-accent hover:underline">
      [C{id}]
    </sup>
  );
}
