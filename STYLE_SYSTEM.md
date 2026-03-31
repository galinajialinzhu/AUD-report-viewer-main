# 报告样式系统 - 使用指南

## 📋 概述

为了确保生成的报告网站UI能够从预设的样式中调取，保证每次组件都是美观的，我们创建了一个统一的样式系统。

## 🎯 核心目标

1. **一致性**：所有组件使用相同的设计模式
2. **可维护性**：样式集中管理，易于更新
3. **美观性**：遵循咨询级设计标准
4. **类型安全**：TypeScript 类型定义确保正确使用

## 📁 文件结构

```
lib/
  ├── report-styles.ts          # 样式工具库（核心文件）
  ├── report-styles-guide.md    # 详细使用指南
components/report/
  ├── example-component.tsx     # 示例组件
  └── ...                       # 其他组件（应使用样式工具库）
app/
  └── globals.css               # CSS 变量定义
```

## 🚀 快速开始

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
  accentBar,
  cn,
} from '@/lib/report-styles';
```

### 2. 创建组件

```tsx
export function MyComponent() {
  const colors = statusColors.success;
  
  return (
    <div className={cn(cardContainer.base, colors.bgLight)}>
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

## ✅ 检查清单

在创建或修改组件时，请确保：

- [ ] 使用 `cardContainer` 而不是硬编码容器样式
- [ ] 使用 `textStyles` 而不是硬编码文本样式
- [ ] 使用 `statusColors` 而不是硬编码颜色值
- [ ] 使用 `iconContainer` 和 `iconSize` 而不是硬编码图标尺寸
- [ ] 使用 `cn()` 函数合并多个类名
- [ ] 遵循标准组件结构模式

## 🔍 如何验证

### 检查硬编码颜色

搜索代码中是否有硬编码的颜色值：

```bash
# 搜索硬编码颜色
grep -r "bg-\[#" components/
grep -r "text-\[#" components/
grep -r "#[0-9A-Fa-f]\{6\}" components/
```

### 检查是否使用样式工具库

```bash
# 检查组件是否导入样式工具库
grep -r "from '@/lib/report-styles'" components/
```

## 📚 可用样式

### 容器样式

- `cardContainer.base` - 标准卡片
- `cardContainer.alt` - 替代卡片
- `cardHeader.base` - 标准头部
- `cardHeader.compact` - 紧凑头部
- `cardContent.base` - 标准内容
- `cardContent.medium` - 中等内容
- `cardContent.large` - 大内容

### 文本样式

- `textStyles.pageTitle` - 页面标题
- `textStyles.sectionHeading` - 章节标题
- `textStyles.componentTitle` - 组件标题
- `textStyles.body` - 正文
- `textStyles.label` - 标签
- `textStyles.largeNumber` - 大号数字

### 状态颜色

- `statusColors.success` - 成功状态
- `statusColors.warning` - 警告状态
- `statusColors.danger` - 危险状态
- `statusColors.neutral` - 中性状态

### 图标样式

- `iconContainer.small` - 小容器 (7x7)
- `iconContainer.medium` - 中等容器 (9x9)
- `iconContainer.large` - 大容器 (12x12)
- `iconSize.small` - 小图标 (3.5x3.5)
- `iconSize.medium` - 中等图标 (4x4)
- `iconSize.large` - 大图标 (5x5)

### 强调条

- `accentBar.left.thin` - 左侧细条
- `accentBar.left.medium` - 左侧中等条
- `accentBar.left.thick` - 左侧粗条
- `accentBar.top.*` - 顶部强调条

## 🛠️ 工具函数

### `cn()` - 组合类名

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

## 📖 详细文档

更多详细信息，请参考：
- [样式工具库使用指南](./lib/report-styles-guide.md)
- [示例组件](./components/report/example-component.tsx)

## 🔄 迁移现有组件

如果现有组件使用了硬编码样式，按以下步骤迁移：

1. **导入样式工具库**
   ```tsx
   import { cardContainer, textStyles, ... } from '@/lib/report-styles';
   ```

2. **替换硬编码容器**
   ```tsx
   // 之前
   <div className="rounded-xl border border-gray-300 bg-white">
   
   // 之后
   <div className={cardContainer.base}>
   ```

3. **替换硬编码颜色**
   ```tsx
   // 之前
   <div className="bg-[#15803D]">
   
   // 之后
   <div className={statusColors.success.bg}>
   ```

4. **替换硬编码文本样式**
   ```tsx
   // 之前
   <h3 className="text-[13px] font-bold text-gray-900">
   
   // 之后
   <h3 className={textStyles.componentTitle}>
   ```

## ⚠️ 常见错误

### ❌ 不要这样做

```tsx
// 硬编码颜色
<div className="bg-[#15803D]">

// 硬编码样式
<div className="rounded-xl border border-gray-300">

// 直接写类名
<h3 className="text-[13px] font-bold">
```

### ✅ 应该这样做

```tsx
// 使用预设颜色
<div className={statusColors.success.bg}>

// 使用预设容器
<div className={cardContainer.base}>

// 使用预设文本样式
<h3 className={textStyles.componentTitle}>
```

## 🎨 设计原则

1. **一致性**：所有组件遵循相同的视觉语言
2. **层次性**：使用清晰的文本和视觉层次
3. **语义化**：颜色和样式传达语义信息
4. **可访问性**：确保足够的对比度和可读性

## 📝 更新日志

- **2024-01-XX**: 创建样式系统
  - 添加 `lib/report-styles.ts`
  - 创建使用指南
  - 更新示例组件
  - 修复硬编码颜色值
