/**
 * Zoning Status Card - 从 Figma 转换的组件
 * 
 * 原始 Figma 代码已转换为使用项目样式系统
 */

"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  cardContainer,
  textStyles,
  iconContainer,
  iconSize,
  cn,
} from "@/lib/report-styles";

export interface ZoningStatusCardProps {
  title?: string;
  value: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Zoning Status Card 组件
 * 
 * 从 Figma 设计转换而来，使用项目样式系统
 */
export function ZoningStatusCard({
  title = "Zoning Status",
  value,
  description,
  actionLabel = "view zoning status",
  onAction,
}: ZoningStatusCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onAction) {
      onAction();
    } else {
      console.log("View zoning status clicked");
    }
  };

  return (
    <article
      className={cn(
        cardContainer.base,
        "flex flex-col h-[227px] items-start justify-center gap-2.5 px-4 py-0"
      )}
    >
      {/* 图标容器 - 使用预设样式 */}
      <div
        className={cn(
          iconContainer.medium,
          "bg-report-accent-light flex items-center justify-center",
          "w-[50px] h-[50px]" // 保持 Figma 中的精确尺寸
        )}
        role="img"
        aria-label="Location pin icon"
      >
        <MapPin className={cn(iconSize.medium, "text-report-accent")} strokeWidth={2} />
      </div>

      {/* 内容区域 */}
      <div className="flex flex-col items-start justify-center gap-[18px] self-stretch w-full relative flex-1">
        <div className="flex flex-col items-start gap-3 self-stretch w-full">
          {/* 标题 - 使用预设文本样式 */}
          <h2 className={cn(textStyles.label, "self-stretch")}>
            {title}
          </h2>

          {/* 值 - 使用大号数字样式 */}
          <p className={cn(textStyles.largeNumberBig, "whitespace-nowrap")}>
            {value}
          </p>

          {/* 描述 - 使用正文样式 */}
          {description && (
            <p className={textStyles.bodySecondary}>
              {description}
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <button
          className={cn(
            "inline-flex items-center justify-center gap-1.5 relative",
            "cursor-pointer group"
          )}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={actionLabel}
          type="button"
        >
          {/* 箭头图标 - 使用简单的 SVG 或 Lucide 图标 */}
          <div
            className="relative w-4 h-[13px] overflow-hidden rotate-[135deg]"
            aria-hidden="true"
          >
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

          <span className="inline-flex h-[33px] items-center gap-[15px] px-0 py-4 rounded-[5px] relative">
            <span
              className={cn(
                "relative w-fit mt-[-10.50px] mb-[-8.50px]",
                "text-[14px] font-normal text-report-accent",
                "whitespace-nowrap transition-all",
                isHovered && "underline underline-offset-2"
              )}
            >
              {actionLabel}
            </span>
          </span>
        </button>
      </div>
    </article>
  );
}
