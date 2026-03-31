/**
 * Module Cards - 方块小卡片组件
 * 
 * 根据 Figma 设计创建的模块卡片组件
 * 每个卡片包含：图标、标题、值/描述、操作链接
 * 支持阴影效果（从 Figma 设计转换）
 */

import { 
  MapPin, 
  Home, 
  CircleDollarSign, 
  Clock,
  type LucideIcon 
} from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { 
  cardContainer, 
  shadowCard,
  textStyles, 
  iconContainer, 
  iconSize,
  cn 
} from "@/lib/report-styles";

export interface ModuleCardData {
  id?: string;
  icon: string | LucideIcon;
  title: string;
  value: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: "accent" | "green" | "amber" | "red" | "purple";
  shadowColor?: "blue" | "green" | "purple" | "amber" | "yellow" | "red" | "none";
}

export interface ModuleCardsProps {
  cards: ModuleCardData[];
  columns?: 2 | 3 | 4;
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
 * 单个模块卡片
 */
function ModuleCard({ 
  icon, 
  title, 
  value, 
  description, 
  actionLabel,
  onAction,
  iconColor = "accent",
  shadowColor = "none"
}: ModuleCardData) {
  // 解析图标（支持字符串或 LucideIcon）
  const IconComponent = typeof icon === "string" 
    ? resolveIcon(icon) 
    : icon;
  
  // 如果图标无法解析，使用默认图标
  const Icon = IconComponent || MapPin;

  // 根据图标颜色选择样式
  const iconColorMap = {
    accent: "bg-report-accent-light text-report-accent",
    green: "bg-report-green/10 text-report-green",
    amber: "bg-report-amber/10 text-report-amber",
    red: "bg-report-red/10 text-report-red",
    purple: "bg-report-purple/10 text-report-purple",
  };

  // 获取阴影样式
  const shadowStyle = shadowColor !== "none" ? shadowColorMap[shadowColor] : "";

  return (
    <div className={cn(
      cardContainer.baseNoShadow, 
      "p-4 flex flex-col h-full gap-4",
      shadowStyle
    )}>
      {/* 图标 */}
      <div className={cn(iconContainer.medium, iconColorMap[iconColor], "flex items-center justify-center mb-3 w-[50px] h-[50px]")}>
        <Icon className={iconSize.medium} strokeWidth={2} />
      </div>

      {/* 标签 */}
      <p className={cn(textStyles.label, "mb-1")}>
        {title}
      </p>

      {/* 值/描述 */}
      <div className="flex-1">
        <p className={cn(textStyles.largeNumberBig, "mb-1 whitespace-nowrap")}>
          {value}
        </p>
        {description && (
          <p className={textStyles.bodySecondary}>
            {description}
          </p>
        )}
      </div>

      {/* 操作链接 */}
      {actionLabel && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onAction) onAction();
          }}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 text-[14px] font-normal text-report-accent",
            "hover:text-report-accent-dark transition-colors",
            "underline-offset-2 hover:underline"
          )}
        >
          {/* 箭头图标 */}
          <div className="relative w-4 h-[13px] overflow-hidden rotate-[135deg]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-report-accent"
            >
              <path
                d="M4 12L12 4M12 4H4M12 4V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>{actionLabel}</span>
        </a>
      )}
    </div>
  );
}

/**
 * 模块卡片网格容器
 */
export function ModuleCards({ cards, columns = 4 }: ModuleCardsProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 w-full md:gap-9", gridCols[columns])}>
      {cards.map((card, index) => (
        <ModuleCard key={card.id || index} {...card} />
      ))}
    </div>
  );
}

/**
 * 预设的模块卡片数据（根据 Figma 设计）
 * 可以直接使用或作为参考
 */
export const defaultModuleCards: ModuleCardData[] = [
  {
    id: "zoning-status",
    icon: MapPin,
    title: "Zoning Status",
    value: "By-right Eligible",
    description: "R-1-8 (no Special Permit Needed)",
    actionLabel: "view zoning status",
    iconColor: "accent",
    shadowColor: "green",
  },
  {
    id: "max-adu-size",
    icon: Home,
    title: "Max ADU Size",
    value: "800 sq ft",
    description: "2 Bed / 2 Bath Possible",
    actionLabel: "check design options",
    iconColor: "accent",
    shadowColor: "purple",
  },
  {
    id: "est-roi",
    icon: CircleDollarSign,
    title: "Est. ROI",
    value: "10.8%",
    description: "7.5 Years Payback Period",
    actionLabel: "view financial analysis",
    iconColor: "accent",
    shadowColor: "amber",
  },
  {
    id: "timeline",
    icon: Clock,
    title: "Timeline",
    value: "8-10 Mos",
    description: "From Design to Move-in",
    actionLabel: "see construction plan",
    iconColor: "accent",
    shadowColor: "yellow",
  },
];
