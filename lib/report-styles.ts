/**
 * Report Design System - 样式工具库
 * 
 * 这个文件定义了所有报告组件应该使用的预设样式模式。
 * 确保所有组件都从这个文件中导入样式，以保持UI的一致性和美观性。
 * 
 * 使用示例：
 * ```tsx
 * import { cardContainer, cardHeader, textStyles, statusColors, cn } from '@/lib/report-styles';
 * 
 * export function MyComponent() {
 *   const successColors = statusColors.success;
 *   return (
 *     <div className={cn(cardContainer.base, successColors.bg)}>
 *       <div className={cardHeader.base}>
 *         <h3 className={textStyles.componentTitle}>标题</h3>
 *       </div>
 *       <div className={cardContent.base}>
 *         <p className={textStyles.body}>内容</p>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// 类型定义
// ============================================================================

export type StatusType = keyof typeof statusColors;
export type IconSize = keyof typeof iconContainer;
export type AccentBarPosition = "left" | "top";
export type AccentBarThickness = "thin" | "medium" | "thick";

// ============================================================================
// 容器样式模式
// ============================================================================

/**
 * 标准卡片容器样式
 * 用于所有数据组件的根容器
 * 设计规范: Fill #FEFEFF, Stroke #000000, 投影见 shadowCard
 */
export const cardContainer = {
  base: "overflow-hidden rounded-[10px] border border-report-stroke bg-report-fill p-4",
  /** 无投影的卡片，需配合 shadowCard 使用 */
  baseNoShadow: "overflow-hidden rounded-[10px] border border-report-stroke bg-report-fill",
  alt: "overflow-hidden rounded-[10px] border border-report-stroke bg-report-surface-alt",
} as const;

/**
 * 卡片投影（设计规范 6 色）
 * blue / green / purple / amber / yellow / red
 */
export const shadowCard = {
  blue: "shadow-[7px_7px_0_var(--shadow-report-blue)]",
  green: "shadow-[7px_7px_0_var(--shadow-report-green)]",
  purple: "shadow-[7px_7px_0_var(--shadow-report-purple)]",
  amber: "shadow-[7px_7px_0_var(--shadow-report-amber)]",
  yellow: "shadow-[7px_7px_0_var(--shadow-report-yellow)]",
  red: "shadow-[7px_7px_0_var(--shadow-report-red)]",
  none: "",
} as const;

/**
 * 卡片头部样式
 * 用于组件顶部的标题栏
 */
export const cardHeader = {
  base: "border-b border-report-border-light bg-report-surface-alt px-5 py-3",
  compact: "border-b border-report-border-light bg-report-surface-alt px-5 py-3.5",
} as const;

/**
 * 卡片内容区域样式
 */
export const cardContent = {
  base: "px-5 py-4",
  medium: "px-5 py-4",
  large: "px-5 py-5",
} as const;

// ============================================================================
// 强调条样式
// ============================================================================

/**
 * 左侧强调条（用于高亮重要内容）
 */
export const accentBar = {
  left: {
    thin: "absolute inset-y-0 left-0 w-1",
    medium: "absolute inset-y-0 left-0 w-1.5",
    thick: "absolute inset-y-0 left-0 w-2",
  },
  top: {
    thin: "absolute inset-x-0 top-0 h-1",
    medium: "absolute inset-x-0 top-0 h-1.5",
    thick: "absolute inset-x-0 top-0 h-2",
  },
} as const;

// ============================================================================
// 图标容器样式
// ============================================================================

/**
 * 图标容器样式
 * 用于组件中的图标背景
 */
export const iconContainer = {
  small: "h-7 w-7 rounded-lg",
  medium: "h-9 w-9 rounded-xl",
  large: "h-12 w-12 rounded-xl",
} as const;

/**
 * 图标尺寸
 */
export const iconSize = {
  small: "h-3.5 w-3.5",
  medium: "h-4 w-4",
  large: "h-5 w-5",
  xlarge: "h-7 w-7",
} as const;

// ============================================================================
// 文本样式模式
// ============================================================================

/**
 * 标题样式
 */
export const textStyles = {
  // 页面标题
  pageTitle: "font-serif text-[32px] leading-tight text-report-text",
  
  // 章节标题
  sectionHeading: "text-[11px] font-bold uppercase tracking-[0.14em] text-report-text",
  
  // 组件标题
  componentTitle: "text-[13px] font-bold tracking-[-0.01em] text-report-text",
  componentTitleLarge: "text-[14px] font-bold text-report-text",
  
  // 正文
  body: "text-[13.5px] leading-relaxed text-report-text",
  bodySecondary: "text-[13px] leading-[1.7] text-report-text-secondary",
  bodySmall: "text-[12px] leading-[1.6] text-report-text-secondary",
  
  // 标签
  label: "text-[10px] font-bold uppercase tracking-[0.12em] text-report-text-tertiary",
  labelSmall: "text-[9px] font-bold uppercase tracking-[0.1em] text-report-text-tertiary",
  labelTiny: "text-[8px] font-bold uppercase tracking-[0.12em]",
  
  // 大号数字（使用衬线字体）
  largeNumber: "font-serif text-[20px] text-report-accent",
  largeNumberBig: "font-serif text-[24px] leading-none text-report-accent",
  
  // 等宽数据
  monospace: "font-mono text-[10.5px] tabular-nums text-report-text-secondary",
  monospaceMedium: "font-mono text-[11.5px] tabular-nums text-report-text-secondary",
} as const;

// ============================================================================
// 徽章样式
// ============================================================================

/**
 * 状态徽章样式
 */
export const badgeStyles = {
  base: "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
  small: "rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
  tiny: "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
} as const;

// ============================================================================
// 状态颜色配置
// ============================================================================

/**
 * 状态颜色配置
 * 用于不同状态的组件（成功、警告、危险等）
 */
export const statusColors = {
  success: {
    bg: "bg-report-green-bg",
    bgLight: "bg-report-green-bg/50",
    bgSubtle: "bg-report-green-bg/30",
    border: "border-report-green/20",
    borderStrong: "border-report-green-border",
    text: "text-report-green",
    iconBg: "bg-report-green/10",
    iconColor: "text-report-green",
    accentBar: "bg-report-green",
    badgeBg: "bg-report-green",
    badgeText: "text-report-green",
    badgeBgAlt: "bg-report-green-bg",
  },
  warning: {
    bg: "bg-report-amber-bg",
    bgLight: "bg-report-amber-bg/50",
    bgSubtle: "bg-report-amber-bg/30",
    border: "border-report-amber/20",
    borderStrong: "border-report-amber-border",
    text: "text-report-amber",
    iconBg: "bg-report-amber/10",
    iconColor: "text-report-amber",
    accentBar: "bg-report-amber",
    badgeBg: "bg-report-amber",
    badgeText: "text-report-amber",
    badgeBgAlt: "bg-report-amber-bg",
  },
  danger: {
    bg: "bg-report-red-bg",
    bgLight: "bg-report-red-bg/50",
    bgSubtle: "bg-report-red-bg/30",
    border: "border-report-red/20",
    borderStrong: "border-report-red-border",
    text: "text-report-red",
    iconBg: "bg-report-red/10",
    iconColor: "text-report-red",
    accentBar: "bg-report-red",
    badgeBg: "bg-report-red",
    badgeText: "text-white",
    badgeBgAlt: "bg-report-red-bg",
  },
  neutral: {
    bg: "bg-report-accent-light",
    bgLight: "bg-report-accent-light/50",
    bgSubtle: "bg-report-surface-alt",
    border: "border-report-border-light",
    borderStrong: "border-report-border",
    text: "text-report-accent",
    iconBg: "bg-report-accent/10",
    iconColor: "text-report-accent",
    accentBar: "bg-report-accent",
    badgeBg: "bg-report-accent/10",
    badgeText: "text-report-accent",
    badgeBgAlt: "bg-report-accent-light",
  },
} as const;

// ============================================================================
// 间距模式
// ============================================================================

/**
 * 间距工具类
 */
export const spacing = {
  sectionGap: "mt-12 mb-6",
  cardGap: "gap-2.5",
  cardGapMedium: "gap-3",
  cardGapLarge: "gap-4",
} as const;

// ============================================================================
// 布局模式
// ============================================================================

/**
 * 网格布局
 */
export const gridLayouts = {
  twoCol: "grid grid-cols-2 gap-3",
  fourCol: "grid grid-cols-2 gap-3 sm:grid-cols-4",
  threeCol: "grid grid-cols-1 gap-2.5 md:grid-cols-3",
} as const;

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 组合样式类名
 * 用于合并多个样式类
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 获取状态颜色配置
 */
export function getStatusColors(status: keyof typeof statusColors) {
  return statusColors[status];
}

/**
 * 创建卡片样式
 */
export function createCardStyle(variant: "base" | "alt" = "base") {
  return cardContainer[variant];
}

/**
 * 创建图标容器样式
 */
export function createIconContainer(size: keyof typeof iconContainer) {
  return iconContainer[size];
}

/**
 * 创建强调条样式
 */
export function createAccentBar(
  position: "left" | "top",
  thickness: "thin" | "medium" | "thick"
) {
  return accentBar[position][thickness];
}
