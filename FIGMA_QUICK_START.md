# Figma 快速开始指南

## 🚀 5 分钟快速导出

### 方法 1: 使用 Figma Dev Mode（最简单）

1. **在 Figma 中**：
   - 选择要导出的组件
   - 点击右上角 "Dev Mode" 切换按钮
   - 查看右侧面板的 CSS 属性

2. **复制信息**：
   - 颜色值（HEX）
   - 字体和字号
   - 间距值（padding, margin）
   - 圆角值（border-radius）

3. **在项目中**：
   - 将颜色添加到 `app/globals.css`
   - 使用 `lib/report-styles.ts` 中的样式创建组件

### 方法 2: 使用 Figma 插件（自动化）

1. **安装插件**：
   - 在 Figma 中：Plugins → Browse plugins
   - 搜索 "Figma to React" 或 "html.to.design"
   - 安装插件

2. **导出代码**：
   - 选择组件
   - 运行插件
   - 选择 "React + Tailwind CSS"
   - 复制代码

3. **转换代码**：
   - 将硬编码样式替换为 `lib/report-styles.ts` 中的样式
   - 参考下面的转换示例

## 📋 转换检查清单

导出代码后，检查并替换：

- [ ] `bg-white` → `bg-report-surface` 或 `cardContainer.base`
- [ ] `rounded-xl` → 使用 `cardContainer.base`（已包含）
- [ ] `text-sm font-bold` → `textStyles.componentTitle`
- [ ] `text-gray-900` → `text-report-text`
- [ ] `p-5` → `cardContent.base`
- [ ] `border border-gray-200` → `border border-report-border-light`
- [ ] 添加 `import { cn } from '@/lib/report-styles'`
- [ ] 使用 `cn()` 函数合并类名

## 🔄 转换示例

### 之前（Figma 导出）

```tsx
<div className="flex flex-col p-5 bg-white rounded-xl border border-gray-200">
  <h3 className="text-sm font-bold text-gray-900">标题</h3>
  <p className="text-xs text-gray-600">内容</p>
</div>
```

### 之后（使用样式系统）

```tsx
import { cardContainer, cardContent, textStyles, cn } from '@/lib/report-styles';

<div className={cardContainer.base}>
  <div className={cardContent.base}>
    <h3 className={textStyles.componentTitle}>标题</h3>
    <p className={textStyles.bodySecondary}>内容</p>
  </div>
</div>
```

## 🎨 颜色快速映射

| Figma 颜色 | 项目颜色变量 | 使用位置 |
|-----------|------------|---------|
| 白色背景 | `bg-report-surface` | 卡片背景 |
| 浅灰背景 | `bg-report-surface-alt` | 头部栏 |
| 深蓝 | `bg-report-accent` | 强调色 |
| 绿色 | `bg-report-green` | 成功状态 |
| 琥珀色 | `bg-report-amber` | 警告状态 |
| 红色 | `bg-report-red` | 危险状态 |

## 📝 常见组件模板

### 卡片组件

```tsx
import { cardContainer, cardHeader, cardContent, textStyles } from '@/lib/report-styles';

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

### 带状态的卡片

```tsx
import { cardContainer, statusColors, cn, getStatusColors } from '@/lib/report-styles';

export function StatusCard({ status }: { status: 'success' | 'warning' | 'danger' }) {
  const colors = getStatusColors(status);
  
  return (
    <div className={cn(cardContainer.base, colors.bgLight)}>
      {/* 内容 */}
    </div>
  );
}
```

## 🛠️ 需要帮助？

- 查看完整指南：`FIGMA_TO_CODE.md`
- 查看样式系统：`STYLE_SYSTEM.md`
- 查看示例组件：`components/report/example-component.tsx`
