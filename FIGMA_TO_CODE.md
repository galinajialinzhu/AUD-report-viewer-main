# Figma 到代码集成指南

## 📋 概述

本指南将帮助您从 Figma 导出 UI 设计并集成到报告查看器项目中，同时确保使用预设的样式系统。

## 🎯 推荐方法

### 方法 1: Figma Dev Mode + 手动转换（推荐）

**优点**：最灵活，可以完全控制代码质量，与现有样式系统完美集成

**步骤**：

1. **在 Figma 中准备设计**
   - 确保设计使用了 Figma Variables（设计令牌）
   - 将组件标记为组件（Components）
   - 使用 Auto Layout 和 Constraints

2. **使用 Figma Dev Mode**
   - 在 Figma 中打开 Dev Mode（右上角切换）
   - 选择要导出的组件或框架
   - 查看右侧面板的代码规范（CSS、间距、颜色等）

3. **提取设计令牌**
   - 从 Figma 复制颜色值
   - 记录字体、字号、行高、间距等
   - 记录圆角、阴影等样式属性

4. **转换为项目样式**
   - 将颜色值添加到 `app/globals.css` 的 `@theme inline` 块
   - 更新 `lib/report-styles.ts` 中的样式常量
   - 创建对应的组件

### 方法 2: Figma 插件自动导出

#### 2.1 Figma to React (推荐插件)

**安装**：
1. 在 Figma 中打开 Plugins 菜单
2. 搜索 "Figma to React" 或 "Figma to Code"
3. 安装并运行插件

**使用步骤**：
1. 选择要导出的组件
2. 运行插件，选择导出格式（React + Tailwind CSS）
3. 复制生成的代码
4. **重要**：将硬编码的样式替换为 `lib/report-styles.ts` 中的预设样式

#### 2.2 Anima (高级工具)

**特点**：
- 支持 React、Vue、HTML/CSS
- 可以导出完整的组件代码
- 需要 Figma 插件 + 在线平台

**使用**：
1. 安装 Anima Figma 插件
2. 在 Anima 平台创建项目
3. 同步 Figma 设计
4. 导出代码

### 方法 3: 使用 Figma API + 脚本

**适合**：需要批量导出或自动化流程

**工具**：
- `figma-api` npm 包
- 自定义 Node.js 脚本

## 🔧 具体实施步骤

### 步骤 1: 从 Figma 提取设计令牌

#### 提取颜色

在 Figma 中：
1. 选择使用颜色的元素
2. 查看右侧面板的 Fill 或 Stroke
3. 记录颜色值（HEX、RGB 或 HSL）

**示例**：
```
Figma 颜色: #1B3A5C
↓
添加到 globals.css:
--color-report-accent: #1B3A5C;
```

#### 提取字体和排版

记录以下信息：
- 字体族（Font Family）
- 字号（Font Size）
- 字重（Font Weight）
- 行高（Line Height）
- 字间距（Letter Spacing）

**示例**：
```
Figma:
- Font: DM Sans
- Size: 13px
- Weight: Bold
- Line Height: 1.5
- Letter Spacing: -0.01em

↓
添加到 report-styles.ts:
componentTitle: "text-[13px] font-bold tracking-[-0.01em] text-report-text"
```

#### 提取间距

记录：
- Padding（内边距）
- Margin（外边距）
- Gap（间距）

**示例**：
```
Figma:
- Padding: 20px 20px 16px 20px (top, right, bottom, left)
↓
转换为 Tailwind:
px-5 py-3 (20px = 5 * 4px, 16px = 3 * 4px + 4px)
```

### 步骤 2: 更新样式系统

#### 2.1 添加新颜色到 globals.css

```css
@theme inline {
  /* 现有颜色... */
  
  /* 从 Figma 添加的新颜色 */
  --color-report-new-color: #YOUR_COLOR;
  --color-report-new-color-bg: #YOUR_BG_COLOR;
  --color-report-new-color-border: #YOUR_BORDER_COLOR;
}
```

#### 2.2 更新 report-styles.ts

```typescript
// 添加新的状态颜色（如果需要）
export const statusColors = {
  // ... 现有状态
  newStatus: {
    bg: "bg-report-new-color-bg",
    text: "text-report-new-color",
    iconBg: "bg-report-new-color/10",
    // ...
  },
} as const;

// 添加新的文本样式（如果需要）
export const textStyles = {
  // ... 现有样式
  newTextStyle: "text-[14px] font-medium text-report-text",
} as const;
```

### 步骤 3: 创建组件

#### 3.1 从 Figma 导出代码（使用插件）

如果使用 Figma to React 插件：

1. 选择组件
2. 运行插件
3. 复制生成的代码

**示例输出**（需要转换）：
```tsx
// Figma 插件生成的代码（需要转换）
<div className="flex flex-col p-5 bg-white rounded-xl border border-gray-200">
  <h3 className="text-sm font-bold text-gray-900">标题</h3>
  <p className="text-xs text-gray-600">内容</p>
</div>
```

#### 3.2 转换为使用样式系统

```tsx
// 转换后的代码（使用样式系统）
import { cardContainer, cardHeader, cardContent, textStyles, cn } from '@/lib/report-styles';

export function MyComponent() {
  return (
    <div className={cardContainer.base}>
      <div className={cardHeader.base}>
        <h3 className={textStyles.componentTitle}>标题</h3>
      </div>
      <div className={cardContent.base}>
        <p className={textStyles.bodySecondary}>内容</p>
      </div>
    </div>
  );
}
```

### 步骤 4: 映射 Figma 样式到项目样式

创建映射表：

| Figma 样式 | 项目样式 | 位置 |
|-----------|---------|------|
| 卡片容器 | `cardContainer.base` | `lib/report-styles.ts` |
| 头部栏 | `cardHeader.base` | `lib/report-styles.ts` |
| 内容区域 | `cardContent.base` | `lib/report-styles.ts` |
| 标题文本 | `textStyles.componentTitle` | `lib/report-styles.ts` |
| 正文 | `textStyles.body` | `lib/report-styles.ts` |
| 成功颜色 | `statusColors.success` | `lib/report-styles.ts` |
| 警告颜色 | `statusColors.warning` | `lib/report-styles.ts` |
| 危险颜色 | `statusColors.danger` | `lib/report-styles.ts` |

## 🛠️ 实用工具和脚本

### 工具 1: 颜色提取脚本

创建一个脚本来批量提取 Figma 颜色：

```typescript
// scripts/extract-figma-colors.ts
// 从 Figma API 提取颜色并生成 CSS 变量

interface FigmaColor {
  name: string;
  value: string; // HEX
}

// 使用 Figma API 提取颜色
// 然后生成 globals.css 格式的输出
```

### 工具 2: 样式转换助手

创建一个转换函数，将 Figma 导出的类名转换为项目样式：

```typescript
// lib/figma-converter.ts

export function convertFigmaClasses(figmaClasses: string): string {
  const mapping: Record<string, string> = {
    'rounded-xl': 'cardContainer.base', // 需要更智能的映射
    'bg-white': 'bg-report-surface',
    // ... 更多映射
  };
  
  // 转换逻辑
  return convertedClasses;
}
```

## 📝 最佳实践

### 1. 在 Figma 中组织设计

- ✅ 使用 Figma Variables 定义颜色
- ✅ 使用 Components 创建可复用组件
- ✅ 使用 Auto Layout 确保响应式布局
- ✅ 命名规范：使用清晰的图层和组件名称

### 2. 导出前检查

- [ ] 确保所有颜色都使用了 Variables
- [ ] 检查字体是否在项目中可用（或添加字体文件）
- [ ] 验证间距是否符合 4px 网格系统
- [ ] 确认组件结构清晰

### 3. 代码集成

- [ ] 替换所有硬编码颜色为样式系统颜色
- [ ] 使用 `cn()` 函数合并类名
- [ ] 遵循组件结构模式
- [ ] 添加 TypeScript 类型定义

### 4. 测试和验证

- [ ] 视觉对比：确保代码实现与 Figma 设计一致
- [ ] 响应式测试：检查不同屏幕尺寸
- [ ] 可访问性：验证颜色对比度
- [ ] 性能：检查是否有不必要的样式

## 🔄 工作流程示例

### 完整流程

```
1. Figma 设计
   ↓
2. 提取设计令牌（颜色、字体、间距）
   ↓
3. 更新 globals.css（添加新颜色）
   ↓
4. 更新 report-styles.ts（添加新样式）
   ↓
5. 使用 Figma 插件导出组件代码
   ↓
6. 转换代码使用样式系统
   ↓
7. 创建组件文件
   ↓
8. 测试和验证
```

### 示例：导出卡片组件

**Figma 设计**：
- 白色背景，圆角 12px
- 顶部有蓝色强调条
- 标题：DM Sans 13px Bold
- 内容：DM Sans 13.5px Regular

**步骤**：

1. **提取信息**：
   ```
   背景: #FFFFFF → bg-report-surface
   圆角: 12px → rounded-xl
   强调条: #1B3A5C → bg-report-accent
   标题: DM Sans 13px Bold → textStyles.componentTitle
   内容: DM Sans 13.5px → textStyles.body
   ```

2. **创建组件**：
   ```tsx
   import { cardContainer, cardHeader, cardContent, textStyles, accentBar, cn } from '@/lib/report-styles';
   
   export function Card() {
     return (
       <div className={cardContainer.base}>
         <div className={cn(accentBar.top.medium, "bg-report-accent")} />
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

## 🚨 常见问题

### Q: Figma 导出的代码有很多硬编码值，怎么办？

**A**: 这是正常的。需要手动将硬编码值替换为样式系统中的预设值。使用查找替换功能可以加快速度。

### Q: Figma 中的颜色和项目中的颜色不完全匹配？

**A**: 
1. 检查 Figma 中是否使用了正确的设计令牌
2. 如果设计需要新颜色，添加到 `globals.css`
3. 更新 `report-styles.ts` 以包含新颜色

### Q: 如何批量导出多个组件？

**A**: 
1. 使用 Figma API 编写脚本
2. 或使用 Anima 等工具批量导出
3. 或逐个导出并统一转换

### Q: Figma 导出的代码不符合项目结构？

**A**: 
1. 使用导出的代码作为参考
2. 手动重构以符合项目模式
3. 参考 `components/report/example-component.tsx`

## 📚 相关资源

- [Figma Dev Mode 文档](https://help.figma.com/hc/en-us/articles/360055204213)
- [Figma API 文档](https://www.figma.com/developers/api)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [项目样式系统指南](./STYLE_SYSTEM.md)

## 🎯 下一步

1. 在 Figma 中准备您的设计
2. 按照本指南提取设计令牌
3. 更新样式系统
4. 创建组件
5. 测试和迭代

如有问题，请参考：
- `lib/report-styles.ts` - 样式工具库
- `components/report/example-component.tsx` - 示例组件
- `STYLE_SYSTEM.md` - 样式系统文档
