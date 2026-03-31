import type { ReactNode } from "react";

export interface FeasibilityBadgeProps {
  status: "go" | "conditional" | "no-go";
  summary: string;
}

export interface PropertySnapshotProps {
  fields: Array<{ label: string; value: string; span?: number; icon?: string }>;
}

/** 右下角色彩块（随机分配，同行不重复），与 status 无关 */
export type OverlayCornerColor = "blue" | "green" | "purple" | "amber" | "yellow" | "red";

export interface OverlayBadgeProps {
  icon: string;
  label: string;
  value: string;
  status: "positive" | "neutral" | "negative";
  /** 由 OverlayGrid 注入：右下角阴影/色块颜色，同行不重复 */
  cornerColor?: OverlayCornerColor;
}

export interface OverlayGridProps {
  children: ReactNode;
}

export interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  /** 卡片右下角厚实彩色叠层阴影（绿/紫/橙/黄等） */
  shadow?: "blue" | "green" | "purple" | "amber" | "yellow" | "red";
  /** 顶部图标（与 icon-map 一致，如 map-pin, home, circle-dollar-sign, clock） */
  icon?: string;
}

export interface StatRowProps {
  children: ReactNode;
}

export interface RiskItemData {
  level: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface RiskListProps {
  items: RiskItemData[];
}

export interface OpportunityListProps {
  items: Array<{ title: string; description: string }>;
}

export interface ChecklistProgressProps {
  items: Array<{ status: "done" | "partial" | "pending"; label: string }>;
}

export interface SectionHeadingProps {
  title: string;
  icon?: string;
}

export interface CalloutProps {
  type: "info" | "warning" | "success" | "danger";
  title?: string;
  children: ReactNode;
}

export interface CostBreakdownProps {
  title: string;
  items: Array<{ name: string; low: number; high: number; note?: string }>;
  contingencyPercent: number;
}

export interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  highlightColumn?: number;
}

export interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export interface ContactCardProps {
  contacts: Array<{
    category: string;
    department: string;
    phone?: string;
    email?: string;
    website?: string;
  }>;
}

export interface SchemeComparisonProps {
  schemes: Array<{
    name: string;
    recommended?: boolean;
    description: string;
    specs: Array<{ label: string; value: string }>;
    pros: string[];
    cons: string[];
    costRange: string;
    riskLevel?: "high" | "medium" | "low";
    bestFor?: string;
  }>;
}

export interface CostSavingsProps {
  items: Array<{
    name: string;
    low: number;
    high: number;
    condition: string;
  }>;
}

export interface CitationRefProps {
  id: string;
}

export interface TimelineStepProps {
  step: number | string;
  title: string;
  duration?: string;
  /** 每步图标，与 icon-map 一致；不传则按 step 默认（search, lightbulb, file-text, clipboard-check, clock, home） */
  icon?: string;
  children: ReactNode;
}

export interface SourceListProps {
  children: ReactNode;
}

export interface SourceProps {
  id: string;
  label: string;
  url: string;
}

export interface KeyAlertItem {
  type: "danger" | "cost" | "advantage" | "tip" | "financial";
  title: string;
  description: string;
}

export interface KeyAlertsProps {
  alerts: KeyAlertItem[];
}

export interface ModuleCardData {
  icon: string; // 图标名称（通过 icon-map 解析）或 LucideIcon
  title: string;
  value: string;
  description?: string;
  actionLabel?: string;
  iconColor?: "accent" | "green" | "amber" | "red" | "purple";
}

export interface ModuleCardsProps {
  cards: ModuleCardData[];
  columns?: 2 | 3 | 4;
}
