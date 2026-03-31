# Figma 阴影效果转换指南

## 转换说明

从 Figma 导出的代码包含了彩色阴影效果，这些阴影已经集成到 `ModuleCards` 组件中。

## 阴影颜色映射

Figma 设计中的阴影颜色已映射到组件中：

| Figma 阴影颜色 | 组件 shadowColor | 颜色值 |
|---------------|-----------------|--------|
| `#86EFAC` | `green` | 绿色阴影 |
| `#DDD6FE` | `purple` | 紫色阴影 |
| `#FDBA74` | `amber` | 琥珀色阴影 |
| `#FDE68A` | `yellow` | 黄色阴影 |

## 使用方法

### 在 MDX 文件中：

```mdx
<ModuleCards 
  cards={[
    {
      id: "zoning-status",
      icon: "map-pin",
      title: "Zoning Status",
      value: "By-right Eligible",
      description: "R-1-8 (no Special Permit Needed)",
      actionLabel: "view zoning status",
      iconColor: "accent",
      shadowColor: "green",  // 添加阴影效果
    },
    {
      id: "max-adu-size",
      icon: "home",
      title: "Max ADU Size",
      value: "800 sq ft",
      description: "2 Bed / 2 Bath Possible",
      actionLabel: "check design options",
      iconColor: "accent",
      shadowColor: "purple",  // 紫色阴影
    },
    {
      id: "est-roi",
      icon: "circle-dollar-sign",
      title: "Est. ROI",
      value: "10.8%",
      description: "7.5 Years Payback Period",
      actionLabel: "view financial analysis",
      iconColor: "accent",
      shadowColor: "amber",  // 琥珀色阴影
    },
    {
      id: "timeline",
      icon: "calendar",
      title: "Timeline",
      value: "8-10 Mos",
      description: "From Design to Move-in",
      actionLabel: "see construction plan",
      iconColor: "accent",
      shadowColor: "yellow",  // 黄色阴影
    }
  ]}
/>
```

## 转换要点

### 1. 移除 SVG 图片导入

```tsx
// ❌ Figma 导出
import vector from "./vector.svg";
import image from "./image.svg";
// ... 更多 SVG

// ✅ 转换后
import { MapPin, Home, CircleDollarSign, Clock } from "lucide-react";
```

### 2. 替换硬编码颜色

```tsx
// ❌ Figma 导出
bg-[#e9f2fe] text-[#7f7f7f] text-[#2f68de]

// ✅ 转换后
bg-report-accent-light text-report-text-tertiary text-report-accent
```

### 3. 替换硬编码字体

```tsx
// ❌ Figma 导出
[font-family:'Montserrat-Regular',Helvetica] font-normal text-sm

// ✅ 转换后
textStyles.label
textStyles.largeNumberBig
textStyles.bodySecondary
```

### 4. 处理阴影效果

```tsx
// ❌ Figma 导出
shadow-[7px_7px_0px_#86efac]

// ✅ 转换后
shadowColor: "green"  // 组件会自动应用正确的阴影
```

### 5. 简化图标

```tsx
// ❌ Figma 导出：复杂的 SVG 组合
<div>
  <img src={vector} />
  <img src={image} />
  <img src={vector2} />
</div>

// ✅ 转换后：简单的 Lucide 图标
<MapPin className={iconSize.medium} />
```

## 组件更新

`ModuleCards` 组件现在支持：

- ✅ `shadowColor` 属性：`"green" | "purple" | "amber" | "yellow" | "none"`
- ✅ `id` 属性：用于唯一标识每个卡片
- ✅ 改进的布局：更符合 Figma 设计
- ✅ 箭头图标：使用 SVG 而不是图片

## 预设数据

组件已包含预设的卡片数据（`defaultModuleCards`），可以直接使用：

```tsx
import { ModuleCards, defaultModuleCards } from '@/components/report/module-cards';

<ModuleCards cards={defaultModuleCards} />
```

## 注意事项

1. **阴影效果**：阴影使用 Tailwind 的 `shadow-[...]` 语法，确保 Tailwind 配置正确
2. **图标颜色**：所有图标使用 `accent` 颜色（`bg-report-accent-light`），与 Figma 设计一致
3. **间距**：卡片之间的间距使用 `gap-9`（36px），与 Figma 设计一致
4. **高度**：卡片高度固定为 `h-[227px]`，与 Figma 设计一致
