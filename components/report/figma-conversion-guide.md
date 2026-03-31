# Figma 代码转换指南

## 转换示例：Zoning Status Card

### 原始 Figma 代码的问题

1. **硬编码颜色**：
   - `bg-[#e9f2fe]` → 应使用 `bg-report-accent-light`
   - `text-[#7f7f7f]` → 应使用 `text-report-text-tertiary`
   - `text-[#2f68de]` → 应使用 `text-report-accent`

2. **硬编码字体**：
   - `[font-family:'Montserrat-Regular',Helvetica]` → 应使用项目的字体系统（DM Sans）

3. **硬编码尺寸**：
   - `h-[227px]` → 保持（特定设计需求）
   - `w-[50px] h-[50px]` → 可以使用 `iconContainer.medium`

4. **SVG 图标**：
   - 复杂的 SVG 组合 → 使用 Lucide React 图标（`MapPin`）

5. **硬编码样式类**：
   - `rounded-[10px]` → 应使用 `rounded-xl`（项目标准）
   - `border border-solid border-black` → 应使用 `border border-report-border-light`

### 转换后的代码

✅ **使用样式系统**：
- `cardContainer.base` - 卡片容器
- `textStyles.label` - 标签文本
- `textStyles.largeNumberBig` - 大号数字
- `textStyles.bodySecondary` - 描述文本
- `iconContainer.medium` - 图标容器
- `iconSize.medium` - 图标尺寸
- `text-report-accent` - 主题色文本

✅ **使用 Lucide 图标**：
- 替换复杂的 SVG 组合为简单的 `MapPin` 图标

✅ **保持功能**：
- Hover 效果
- 点击事件
- 可访问性属性

## 转换步骤

### 1. 识别硬编码值

```tsx
// ❌ 硬编码
className="bg-[#e9f2fe] text-[#7f7f7f]"

// ✅ 使用样式系统
className={cn("bg-report-accent-light", textStyles.bodySecondary)}
```

### 2. 替换颜色

| Figma 颜色 | 项目颜色变量 |
|-----------|------------|
| `#e9f2fe` | `bg-report-accent-light` |
| `#7f7f7f` | `text-report-text-tertiary` |
| `#2f68de` | `text-report-accent` |
| `#000000` | `text-report-text` |

### 3. 替换字体

```tsx
// ❌ 硬编码字体
[font-family:'Montserrat-Regular',Helvetica]

// ✅ 使用预设文本样式
textStyles.label
textStyles.bodySecondary
textStyles.largeNumberBig
```

### 4. 替换图标

```tsx
// ❌ 复杂的 SVG 组合
<div>
  <img src={vector} />
  <img src={image} />
  <img src={vector2} />
</div>

// ✅ 使用 Lucide 图标
<MapPin className={iconSize.medium} />
```

### 5. 使用 cn() 函数

```tsx
// ❌ 字符串拼接
className={`base-class ${isHovered ? "hover-class" : ""}`}

// ✅ 使用 cn() 函数
className={cn("base-class", isHovered && "hover-class")}
```

## 检查清单

转换代码时，确保：

- [ ] 所有颜色都使用 `report-*` 颜色变量
- [ ] 所有文本样式都使用 `textStyles.*`
- [ ] 所有容器都使用 `cardContainer.*`
- [ ] 所有图标都使用 Lucide React 图标
- [ ] 使用 `cn()` 函数合并类名
- [ ] 移除了所有硬编码的字体名称
- [ ] 移除了所有 SVG 图片导入（除非必要）
- [ ] 保持了原有的功能和交互

## 使用转换后的组件

在 MDX 文件中：

```mdx
<ZoningStatusCard
  title="Zoning Status"
  value="By-right Eligible"
  description="R-1-8 (no Special Permit Needed)"
  actionLabel="view zoning status"
  onAction={() => console.log("Clicked")}
/>
```

## 相关文件

- 转换后的组件：`components/report/zoning-status-card.tsx`
- 样式系统：`lib/report-styles.ts`
- 颜色定义：`app/globals.css`
