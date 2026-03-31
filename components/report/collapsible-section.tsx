"use client";

import { useState } from "react";
import { ChevronRight, Layers } from "lucide-react";
import type { CollapsibleSectionProps } from "@/lib/report-types";

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-report-surface-alt/50"
      >
        <Layers className="h-4 w-4 shrink-0 text-report-text-tertiary" />
        <span className="flex-1 text-[13.5px] font-semibold text-report-text">
          {title}
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-report-text-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-report-border-light px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
