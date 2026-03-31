import { ExternalLink } from "lucide-react";
import type { SourceListProps, SourceProps } from "@/lib/report-types";

export function SourceList({ children }: SourceListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      <div className="border-b border-report-border-light bg-report-surface-alt px-5 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-report-text-tertiary">
          References & Sources
        </span>
      </div>
      <ol className="divide-y divide-report-border-light/60">{children}</ol>
    </div>
  );
}

export function Source({ id, label, url }: SourceProps) {
  return (
    <li className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-report-surface-alt/30">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-report-accent/10 font-mono text-[10px] font-bold text-report-accent">
        {id}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-1.5 text-[12.5px] leading-relaxed text-report-text-secondary transition-colors hover:text-report-accent hover:underline"
      >
        <span className="flex-1">{label}</span>
        <ExternalLink className="h-3 w-3 shrink-0 text-report-text-tertiary" />
      </a>
    </li>
  );
}
