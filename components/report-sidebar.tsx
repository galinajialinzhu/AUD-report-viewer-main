"use client";

import type { SectionInfo } from "@/lib/section-utils";
import { resolveIcon } from "@/lib/icon-map";
import { LayoutDashboard, FileText, ArrowLeft } from "lucide-react";

interface ReportSidebarProps {
  sections: SectionInfo[];
  activeSection: string;
  onSelect: (id: string) => void;
}

export function ReportSidebar({
  sections,
  activeSection,
  onSelect,
}: ReportSidebarProps) {
  const allTabs: SectionInfo[] = sections.length > 0 ? sections : [{ id: "overview", title: "Overview", shortTitle: "Overview", icon: "" }];

  const total = allTabs.length;
  const currentIdx = allTabs.findIndex((t) => t.id === activeSection);
  const progressPct = total > 1 ? ((currentIdx + 1) / total) * 100 : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(total - 1, currentIdx + delta));
      if (next !== currentIdx) onSelect(allTabs[next].id);
    }
  };

  return (
    <nav
      className="report-sidebar flex flex-col font-serif bg-[#EAF1FF]"
      role="tablist"
      aria-label="Report sections"
      onKeyDown={handleKeyDown}
    >
      {/* Report branding */}
      <div className="border-b border-[rgba(47,104,222,0.2)] px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-icon-fill)]">
            <FileText className="h-4 w-4 text-[var(--color-icon-stroke)]" strokeWidth={2} />
          </div>
          <span className="font-serif text-[14px] font-bold text-[#000000]">
            ADU Feasibility
          </span>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-[#2F68DE] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="mt-1 block font-sans text-[10px] tabular-nums text-[#5b5b5b]">
          {currentIdx + 1} / {total}
        </span>
      </div>

      <div className="px-4 pb-2 pt-4">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#5b5b5b]">
          Sections
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 px-2">
        {allTabs.map((section) => {
          const isActive = activeSection === section.id;
          const Icon =
            section.id === "overview"
              ? LayoutDashboard
              : section.icon
                ? resolveIcon(section.icon)
                : null;

          return (
            <li key={section.id}>
              <button
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => onSelect(section.id)}
                className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left font-serif text-[10px] font-bold transition-colors min-w-0 ${
                  isActive
                    ? "border-l-[3px] border-[#2F68DE] bg-white/50 text-[#2F68DE]"
                    : "border-l-[3px] border-transparent text-[#000000] hover:bg-white/40 hover:text-[#000000]"
                }`}
              >
                {Icon && (
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? "bg-[var(--color-icon-fill)]" : "bg-white/60"
                    }`}
                  >
                    <Icon
                      className={`h-3 w-3 ${
                        isActive
                          ? "text-[var(--color-icon-stroke)]"
                          : "text-[#5b5b5b]"
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                )}
                <span className="min-w-0 flex-1 break-words leading-snug">
                  {section.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Back to Home */}
      <div className="mt-auto border-t border-[rgba(47,104,222,0.2)] px-4 pb-4 pt-3">
        <a
          href="/report"
          className="flex items-center gap-2 font-serif text-[10px] font-normal text-[#5b5b5b] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-3 w-3 text-[#5b5b5b]" strokeWidth={2} />
          Back to Home
        </a>
      </div>
    </nav>
  );
}
