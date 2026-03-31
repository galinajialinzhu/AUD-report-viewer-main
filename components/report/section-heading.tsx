import type { SectionHeadingProps } from "@/lib/report-types";
import { resolveIcon } from "@/lib/icon-map";
import { slugify } from "@/lib/section-utils";

export function SectionHeading({ title, icon }: SectionHeadingProps) {
  const Icon = icon ? resolveIcon(icon) : null;

  return (
    <div
      data-section-id={slugify(title)}
      data-section-title={title}
      data-section-icon={icon ?? ""}
      className="mt-12 mb-6"
    >
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-icon-fill)]">
            <Icon className="h-[18px] w-[18px] text-[var(--color-icon-stroke)]" strokeWidth={2} />
          </div>
        ) : icon ? (
          <span className="text-lg">{icon}</span>
        ) : null}
        <span className="text-[14px] font-normal text-report-text">
          {title}
        </span>
      </div>
      <div className="mt-3 flex h-[2px]">
        <div className="w-16 bg-report-accent" />
        <div className="flex-1 bg-report-border" />
      </div>
    </div>
  );
}
