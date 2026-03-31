# 报告样式系统使用指南

## 概述

这个样式系统确保所有报告组件都使用统一的预设样式，保证UI的一致性和美观性。

## 核心原则

1. **始终使用预设样式**：不要硬编码颜色值或样式类
2. **使用样式工具库**：从 `@/lib/report-styles` 导入所有样式
3. **保持一致性**：所有组件遵循相同的设计模式

## 快速开始

### 1. 导入样式工具

```tsx
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
```

### 2. 创建标准卡片组件

```tsx
export function MyCard() {
  return (
    <div className={cardContainer.base}>
      <div className={cardHeader.base}>
        <h3 className={textStyles.componentTitle}>标题</h3>
      </div>
      <div className={cardContent.base}>
        <p className={textStyles.body}>内容</p>
      </div>
    </div>
  );
}
```

### 3. 使用状态颜色

```tsx
export function StatusCard({ status }: { status: 'success' | 'warning' | 'danger' }) {
  const colors = statusColors[status];
  
  return (
    <div className={cn(cardContainer.base, colors.bg)}>
      <div className={cn(colors.accentBar, accentBar.left.medium)} />
      <div className={cardContent.base}>
        <span className={cn(badgeStyles.base, colors.badgeBg, colors.badgeText)}>
          {status}
        </span>
      </div>
    </div>
  );
}
```

## 样式模式参考

### 容器样式

- `cardContainer.base` - 标准卡片容器
- `cardContainer.alt` - 替代卡片容器（浅色背景）
- `cardHeader.base` - 标准头部
- `cardHeader.compact` - 紧凑头部
- `cardContent.base` - 标准内容区域
- `cardContent.medium` - 中等内容区域
- `cardContent.large` - 大内容区域

### 文本样式

- `textStyles.pageTitle` - 页面标题（32px 衬线字体）
- `textStyles.sectionHeading` - 章节标题（11px 大写）
- `textStyles.componentTitle` - 组件标题（13px）
- `textStyles.body` - 正文（13.5px）
- `textStyles.label` - 标签（10px 大写）
- `textStyles.largeNumber` - 大号数字（20px 衬线字体）

### 状态颜色

- `statusColors.success` - 成功/正面状态
- `statusColors.warning` - 警告/中性状态
- `statusColors.danger` - 危险/负面状态
- `statusColors.neutral` - 中性状态

每个状态包含：
- `bg` - 背景色
- `bgLight` - 浅背景色
- `text` - 文本色
- `iconBg` - 图标背景
- `iconColor` - 图标颜色
- `accentBar` - 强调条颜色
- `badgeBg` - 徽章背景
- `badgeText` - 徽章文本

### 图标样式

- `iconContainer.small` - 小图标容器（7x7）
- `iconContainer.medium` - 中等图标容器（9x9）
- `iconContainer.large` - 大图标容器（12x12）
- `iconSize.small` - 小图标（3.5x3.5）
- `iconSize.medium` - 中等图标（4x4）
- `iconSize.large` - 大图标（5x5）

### 强调条样式

- `accentBar.left.thin` - 左侧细条
- `accentBar.left.medium` - 左侧中等条
- `accentBar.left.thick` - 左侧粗条
- `accentBar.top.*` - 顶部强调条（相同厚度选项）

### 徽章样式

- `badgeStyles.base` - 标准徽章
- `badgeStyles.small` - 小徽章
- `badgeStyles.tiny` - 极小徽章

## 工具函数

### `cn()` - 组合类名

用于合并多个样式类：

```tsx
import { cn } from '@/lib/report-styles';

<div className={cn(
  cardContainer.base,
  statusColors.success.bg,
  'custom-class'
)} />
```

### `getStatusColors()` - 获取状态颜色

```tsx
import { getStatusColors } from '@/lib/report-styles';

const colors = getStatusColors('success');
```

## 设计模式

### 标准组件结构

```
容器 (cardContainer.base)
  |-- 头部栏 (cardHeader.base)
  |-- 内容区域 (cardContent.base)
  |-- 可选的强调条 (accentBar.left.medium)
```

### 状态指示器

```tsx
// 状态点
<span className="h-2 w-2 rounded-full bg-report-green" />

// 状态图标容器
<div className={cn(iconContainer.medium, statusColors.success.iconBg)}>
  <Icon className={cn(iconSize.medium, statusColors.success.iconColor)} />
</div>
```

### 标签和徽章

```tsx
// 小标签
<p className={textStyles.label}>标签文本</p>

// 状态徽章
<span className={cn(badgeStyles.base, statusColors.success.badgeBg, statusColors.success.badgeText)}>
  成功
</span>
```

## 最佳实践

1. **不要硬编码颜色**：始终使用 `statusColors` 或 CSS 变量
2. **使用组合函数**：使用 `cn()` 合并多个类名
3. **保持间距一致**：使用预设的间距模式
4. **遵循文本层次**：使用 `textStyles` 中的预设样式
5. **统一图标尺寸**：使用 `iconContainer` 和 `iconSize`

## 常见错误

❌ **错误**：硬编码颜色
```tsx
<div className="bg-[#15803D]">  // 不要这样做
```

✅ **正确**：使用预设样式
```tsx
<div className={statusColors.success.bg}>  // 这样做
```

❌ **错误**：直接写样式类
```tsx
<div className="rounded-xl border border-gray-300">  // 不要这样做
```

✅ **正确**：使用预设容器
```tsx
<div className={cardContainer.base}>  // 这样做
```

## 扩展样式系统

如果需要添加新的样式模式：

1. 在 `lib/report-styles.ts` 中添加新的样式常量
2. 确保遵循现有的命名约定
3. 更新此文档
4. 在现有组件中应用新样式作为示例
