/**
 * Figma 导入示例
 * 
 * 这个文件展示了如何将 Figma 导出的代码转换为使用项目样式系统
 */

// ============================================================================
// 示例 1: Figma 导出的原始代码（需要转换）
// ============================================================================

/**
 * ❌ 这是 Figma 插件可能导出的代码（不要直接使用）
 */
export function FigmaOriginalCard() {
  return (
    <div className="flex flex-col p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-900">标题</h3>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          成功
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">
        这是从 Figma 导出的原始代码，包含很多硬编码的样式值。
      </p>
    </div>
  );
}

// ============================================================================
// 示例 2: 转换后的代码（使用样式系统）✅
// ============================================================================

import {
  cardContainer,
  cardHeader,
  cardContent,
  textStyles,
  statusColors,
  iconContainer,
  iconSize,
  badgeStyles,
  cn,
} from '@/lib/report-styles';
import { Zap } from 'lucide-react';

/**
 * ✅ 转换后的代码 - 使用样式系统
 * 
 * 转换要点：
 * 1. 使用 cardContainer.base 替代硬编码的容器样式
 * 2. 使用 textStyles 替代硬编码的文本样式
 * 3. 使用 statusColors 替代硬编码的颜色
 * 4. 使用 iconContainer 和 iconSize 替代硬编码的图标尺寸
 * 5. 使用 badgeStyles 替代硬编码的徽章样式
 */
export function ConvertedCard() {
  const colors = statusColors.success;
  
  return (
    <div className={cardContainer.base}>
      <div className={cardContent.base}>
        <div className="flex items-center gap-3 mb-4">
          {/* 图标容器 - 使用预设样式 */}
          <div className={cn(iconContainer.medium, colors.iconBg, "flex items-center justify-center")}>
            <Zap className={cn(iconSize.medium, colors.iconColor)} strokeWidth={2} />
          </div>
          
          {/* 标题 - 使用预设文本样式 */}
          <h3 className={textStyles.componentTitle}>标题</h3>
          
          {/* 徽章 - 使用预设样式 */}
          <span className={cn(badgeStyles.base, colors.badgeBg, colors.badgeText, "ml-auto")}>
            成功
          </span>
        </div>
        
        {/* 正文 - 使用预设文本样式 */}
        <p className={textStyles.bodySecondary}>
          这是转换后的代码，使用样式系统，确保一致性和可维护性。
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 示例 3: 带状态指示的卡片
// ============================================================================

/**
 * ✅ 带状态指示的卡片 - 展示如何使用状态颜色
 */
export function StatusCard({ 
  status 
}: { 
  status: 'success' | 'warning' | 'danger' | 'neutral' 
}) {
  const colors = statusColors[status];
  
  return (
    <div className={cn(cardContainer.base, colors.bgLight)}>
      {/* 左侧强调条 */}
      <div className={cn("absolute inset-y-0 left-0 w-1.5", colors.accentBar)} />
      
      <div className={cardHeader.base}>
        <div className="flex items-center gap-2">
          <div className={cn(iconContainer.small, colors.iconBg, "flex items-center justify-center")}>
            <Zap className={cn(iconSize.small, colors.iconColor)} strokeWidth={2} />
          </div>
          <h3 className={textStyles.componentTitle}>状态卡片</h3>
        </div>
      </div>
      
      <div className={cardContent.base}>
        <p className={textStyles.body}>
          这是一个 {status} 状态的卡片，使用预设的状态颜色系统。
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 转换对照表
// ============================================================================

/**
 * Figma 导出 → 项目样式系统 对照表
 * 
 * 容器样式：
 * - "bg-white rounded-xl border border-gray-200" 
 *   → cardContainer.base
 * 
 * 文本样式：
 * - "text-sm font-bold text-gray-900" 
 *   → textStyles.componentTitle
 * - "text-xs text-gray-600" 
 *   → textStyles.bodySecondary
 * 
 * 颜色：
 * - "bg-blue-100" → statusColors.neutral.iconBg
 * - "text-blue-600" → statusColors.neutral.iconColor
 * - "bg-green-100 text-green-700" → statusColors.success.badgeBg + badgeText
 * 
 * 图标：
 * - "w-10 h-10 rounded-lg" → iconContainer.medium
 * - "w-5 h-5" → iconSize.medium
 * 
 * 间距：
 * - "p-5" → cardContent.base
 * - "px-5 py-3" → cardHeader.base
 */