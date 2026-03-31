/**
 * Utility Cards - Dashboard Small Cards
 * 
 * 从 Figma 设计转换的实用工具卡片组件
 * 包含：Water, Sewer, Electric, Solar
 */

import {
  Droplet,
  Wrench,
  Zap,
  Sun,
  type LucideIcon,
} from "lucide-react";
import {
  cardContainer,
  shadowCard,
  textStyles,
  iconContainer,
  iconSize,
  cn,
} from "@/lib/report-styles";

export interface UtilityCardData {
  id: string;
  icon: string | LucideIcon;
  label: string;
  status: string;
  statusColor?: "green" | "amber" | "red" | "accent";
  shadowColor?: "blue" | "green" | "purple" | "amber" | "yellow" | "red" | "none";
}

export interface UtilityCardsProps {
  cards: UtilityCardData[];
}

/**
 * 阴影颜色映射（设计规范: #6F9AED #86EFAC #DDD6FE #FDBA74 #FDE68A #FF9191）
 */
const shadowColorMap = {
  blue: shadowCard.blue,
  green: shadowCard.green,
  purple: shadowCard.purple,
  amber: shadowCard.amber,
  yellow: shadowCard.yellow,
  red: shadowCard.red,
  none: shadowCard.none,
} as const;

/**
 * 状态颜色映射
 */
const statusColorMap = {
  green: "text-report-green",
  amber: "text-report-amber",
  red: "text-report-red",
  accent: "text-report-accent",
} as const;

/**
 * 图标映射
 */
const iconMap: Record<string, LucideIcon> = {
  water: Droplet,
  sewer: Wrench,
  electric: Zap,
  solar: Sun,
};

/**
 * 单个实用工具卡片
 */
function UtilityCard({
  id,
  icon,
  label,
  status,
  statusColor = "green",
  shadowColor = "none",
}: UtilityCardData) {
  // 解析图标
  const IconComponent = typeof icon === "string"
    ? iconMap[icon] || iconMap.water
    : icon;
  
  const Icon = IconComponent;

  // 获取阴影样式
  const shadowStyle = shadowColor !== "none" ? shadowColorMap[shadowColor] : "";
  const statusTextColor = statusColorMap[statusColor];

  return (
    <article
      className={cn(
        cardContainer.baseNoShadow,
        "flex flex-col h-[164px] items-start justify-center gap-4 px-4 py-4 relative flex-1 grow",
        shadowStyle
      )}
    >
      {/* 图标容器 */}
      <div
        className={cn(
          iconContainer.medium,
          "bg-report-accent-light flex items-center justify-center w-[50px] h-[50px]",
          "overflow-hidden"
        )}
        aria-hidden="true"
      >
        <Icon className={cn(iconSize.medium, "text-report-accent")} strokeWidth={2} />
      </div>

      {/* 内容区域 - 间距至少 15px */}
      <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-1">
        {/* 标签 */}
        <h3 className={cn(textStyles.label, "self-stretch")}>
          {label}
        </h3>

        {/* 状态 */}
        <p className={cn(
          "relative w-fit font-normal text-2xl tracking-[0] leading-5 whitespace-nowrap",
          statusTextColor
        )}>
          {status}
        </p>
      </div>
    </article>
  );
}

/**
 * Solar 卡片（特殊样式，带图片区域）
 */
function SolarCard({
  label = "Solar",
  status = "Recommended",
  imageSrc,
}: {
  label?: string;
  status?: string;
  imageSrc?: string;
}) {
  return (
    <article
      className={cn(
        cardContainer.baseNoShadow,
        "flex flex-col w-[269px] h-[164px] items-start justify-center gap-4 px-4 py-4 relative",
        shadowColorMap.yellow
      )}
    >
      {/* 图片区域 */}
      {imageSrc ? (
        <img
          className="relative self-stretch w-full flex-[0_0_auto]"
          alt="Solar illustration"
          src={imageSrc}
          aria-hidden="true"
        />
      ) : (
        <div className="relative self-stretch w-full h-16 flex-[0_0_auto] bg-report-amber-bg/30 rounded-lg flex items-center justify-center">
          <Sun className={cn(iconSize.large, "text-report-amber")} strokeWidth={2} />
        </div>
      )}

      {/* 内容区域 - 间距至少 15px */}
      <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-1">
        {/* 标签 */}
        <h3 className={cn(textStyles.label, "self-stretch")}>
          {label}
        </h3>

        {/* 状态 */}
        <p className={cn(
          "relative w-fit font-normal text-2xl tracking-[0] leading-5 whitespace-nowrap",
          statusColorMap.green
        )}>
          {status}
        </p>
      </div>
    </article>
  );
}

/**
 * 实用工具卡片网格容器
 */
export function UtilityCards({ cards }: UtilityCardsProps) {
  return (
    <section
      className="flex w-full items-center justify-center gap-[max(15px,2.25rem)] relative flex-wrap"
      role="region"
      aria-label="Utility Services Status"
    >
      {cards.map((card) => (
        <UtilityCard key={card.id} {...card} />
      ))}
    </section>
  );
}

/**
 * 带 Solar 卡片的完整组件
 */
export function UtilityCardsWithSolar({
  utilityCards,
  solarCard,
}: {
  utilityCards: UtilityCardData[];
  solarCard?: {
    label?: string;
    status?: string;
    imageSrc?: string;
  };
}) {
  return (
    <section
      className="flex w-full items-center justify-center gap-[max(15px,2.25rem)] relative flex-wrap"
      role="region"
      aria-label="Utility Services Status"
    >
      {utilityCards.map((card) => (
        <UtilityCard key={card.id} {...card} />
      ))}
      {solarCard && <SolarCard {...solarCard} />}
    </section>
  );
}

/**
 * 预设的实用工具卡片数据（根据 Figma 设计）
 */
export const defaultUtilityCards: UtilityCardData[] = [
  {
    id: "water",
    icon: "water",
    label: "Water",
    status: "Available",
    statusColor: "green",
    shadowColor: "green",
  },
  {
    id: "sewer",
    icon: "sewer",
    label: "Sewer",
    status: "Available",
    statusColor: "green",
    shadowColor: "purple",
  },
  {
    id: "electric",
    icon: "electric",
    label: "Electric",
    status: "Upgrade Likely",
    statusColor: "amber",
    shadowColor: "amber",
  },
];
