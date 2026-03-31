/**
 * 示例组件 - 展示如何使用报告样式系统
 * 
 * 这个文件展示了如何创建一个符合设计系统的报告组件。
 * 在创建新组件时，请参考这个示例。
 */

import { 
  cardContainer, 
  cardHeader, 
  cardContent,
  textStyles,
  statusColors,
  iconContainer,
  iconSize,
  badgeStyles,
  accentBar,
  cn,
  getStatusColors,
} from "@/lib/report-styles";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ExampleComponentProps {
  title: string;
  status: "success" | "warning" | "danger" | "neutral";
  items: Array<{ label: string; value: string }>;
}

/**
 * 示例组件 - 展示标准组件结构
 * 
 * 这个组件展示了：
 * 1. 如何使用预设的容器样式
 * 2. 如何使用状态颜色
 * 3. 如何使用文本样式
 * 4. 如何使用图标和徽章
 * 5. 如何使用强调条
 */
export function ExampleComponent({ title, status, items }: ExampleComponentProps) {
  // 获取状态颜色配置
  const colors = getStatusColors(status);
  
  return (
    <div className={cn(cardContainer.base, colors.bgLight)}>
      {/* 强调条 - 左侧 */}
      <div className={cn(accentBar.left.medium, colors.accentBar)} />
      
      {/* 头部栏 */}
      <div className={cardHeader.base}>
        <div className="flex items-center gap-2">
          {/* 图标容器 */}
          <div className={cn(iconContainer.medium, colors.iconBg, "flex items-center justify-center")}>
            {status === "success" ? (
              <CheckCircle2 className={cn(iconSize.medium, colors.iconColor)} strokeWidth={2} />
            ) : (
              <AlertTriangle className={cn(iconSize.medium, colors.iconColor)} strokeWidth={2} />
            )}
          </div>
          
          {/* 标题 */}
          <h3 className={textStyles.componentTitle}>{title}</h3>
          
          {/* 状态徽章 */}
          <span className={cn(badgeStyles.base, colors.badgeBg, colors.badgeText, "ml-auto")}>
            {status}
          </span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className={cardContent.base}>
        {items.map((item, index) => (
          <div key={index} className="mb-3 last:mb-0">
            {/* 标签 */}
            <p className={textStyles.label}>{item.label}</p>
            
            {/* 值 - 使用大号数字样式（如果是数字）或正文样式 */}
            <p className={cn(
              /^\d/.test(item.value) ? textStyles.largeNumber : textStyles.body,
              "mt-1"
            )}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 简化版示例 - 最小化组件
 * 
 * 展示如何用最少的代码创建一个符合设计系统的组件
 */
export function SimpleExampleComponent({ title, description }: { title: string; description: string }) {
  return (
    <div className={cardContainer.base}>
      <div className={cardHeader.base}>
        <h3 className={textStyles.componentTitle}>{title}</h3>
      </div>
      <div className={cardContent.base}>
        <p className={textStyles.body}>{description}</p>
      </div>
    </div>
  );
}
