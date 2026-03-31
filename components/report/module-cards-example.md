# ModuleCards 组件使用示例

## 基本用法

在 MDX 文件中使用 `ModuleCards` 组件：

```mdx
<ModuleCards 
  cards={[
    {
      icon: "map-pin",
      title: "Zoning Status",
      value: "By-right Eligible",
      description: "R-1-8 (no Special Permit Needed)",
      actionLabel: "view zoning status",
      iconColor: "accent"
    },
    {
      icon: "home",
      title: "Max ADU Size",
      value: "800 sq ft",
      description: "2 Bed / 2 Bath Possible",
      actionLabel: "check design options",
      iconColor: "green"
    },
    {
      icon: "circle-dollar-sign",
      title: "Est. ROI",
      value: "10.8%",
      description: "7.5 Years Payback Period",
      actionLabel: "view financial analysis",
      iconColor: "amber"
    },
    {
      icon: "calendar",
      title: "Timeline",
      value: "8-10 Mos",
      description: "From Design to Move-in",
      actionLabel: "see construction plan",
      iconColor: "purple"
    }
  ]}
/>
```

## 自定义列数

```mdx
<!-- 2列布局 -->
<ModuleCards 
  cards={[...]} 
  columns={2}
/>

<!-- 3列布局 -->
<ModuleCards 
  cards={[...]} 
  columns={3}
/>

<!-- 4列布局（默认，响应式：移动端2列，桌面端4列） -->
<ModuleCards 
  cards={[...]} 
  columns={4}
/>
```

## 可用图标

组件支持通过 `icon-map.ts` 解析的图标名称，包括：

- `map-pin` - 位置图标
- `home` - 房子图标
- `circle-dollar-sign` - 美元图标
- `calendar` - 日历图标
- `clock` - 时钟图标
- 以及其他在 `lib/icon-map.ts` 中定义的图标

## 图标颜色选项

- `accent` - 主题色（蓝色）
- `green` - 绿色（成功）
- `amber` - 琥珀色（警告）
- `red` - 红色（危险）
- `purple` - 紫色

## 样式系统

组件完全使用项目的样式系统：

- `cardContainer.base` - 卡片容器
- `textStyles.componentTitle` - 标题样式
- `textStyles.largeNumber` - 大号数字样式
- `textStyles.bodySecondary` - 描述文本样式
- `iconContainer.medium` - 图标容器
- `iconSize.medium` - 图标尺寸

所有样式都从 `lib/report-styles.ts` 导入，确保 UI 一致性。
