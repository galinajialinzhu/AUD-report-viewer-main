import type { StatRowProps, StatCardProps } from "@/lib/report-types";
import { StatCardIcon } from "./stat-card-icon";
import { cardContainer, shadowCard, cn } from "@/lib/report-styles";

export function StatRow({ children }: StatRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {children}
    </div>
  );
}

const shadowMap = {
  blue: shadowCard.blue,
  green: shadowCard.green,
  purple: shadowCard.purple,
  amber: shadowCard.amber,
  yellow: shadowCard.yellow,
  red: shadowCard.red,
} as const;

export function StatCard({ label, value, sub, shadow, icon }: StatCardProps) {
  const shadowClass = shadow ? shadowMap[shadow] : shadowCard.none;

  return (
    <div
      className={cn(
        cardContainer.baseNoShadow,
        "relative flex flex-col",
        shadowClass
      )}
    >
      <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-4">
        {/* 顶部图标：优先 public/icons/{icon}.svg，否则用 icon-map 的 Lucide（home/train/circle-dollar-sign/clock 等） */}
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-icon-fill)] [&_img]:min-w-0">
            <StatCardIcon name={icon} />
          </div>
        )}
        {/* 标题：Montserrat 14 regular */}
        <p className="font-sans text-[14px] font-normal text-report-text-secondary">
          {label}
        </p>
        {/* 主数值：Montserrat 22 bold，避免长数字溢出 */}
        <p className="font-sans text-[22px] font-bold leading-tight text-report-text min-w-0 break-words">
          {value}
        </p>
        {/* 描述：Montserrat 14 light */}
        {sub && (
          <p className="font-sans text-[14px] font-light leading-snug text-report-text-tertiary">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
