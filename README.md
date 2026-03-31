# ADU Feasibility Report Viewer

A consulting-grade interactive report viewer built with **Next.js 16 + React 19 + Tailwind CSS v4 + MDX**. Renders AI-generated ADU (Accessory Dwelling Unit) feasibility reports as polished, navigable web documents.

**Live demo**: `npm run dev` then open `http://localhost:3000/report`

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Context](#project-context)
- [Architecture Overview](#architecture-overview)
- [Design Philosophy](#design-philosophy)
- [Design System](#design-system)
- [Component Reference](#component-reference)
- [Sidebar Navigation System](#sidebar-navigation-system)
- [Data-Driven Personalization](#data-driven-personalization)
- [MDX Authoring Guide](#mdx-authoring-guide)
- [Adding a New Report](#adding-a-new-report)
- [File Map](#file-map)
- [Tech Stack](#tech-stack)
- [Known Limitations & Future Work](#known-limitations--future-work)

---

## Quick Start

```bash
# Prerequisites: Node.js 18+
npm install
npm run dev
# Open http://localhost:3000/report
```

No API keys, no `.env`, no backend required. Everything is self-contained.

---

## Project Context

This viewer is part of a larger ADU research platform that uses OpenAI's o3-deep-research to generate comprehensive feasibility reports for California properties. The reports are ~15,000-20,000 words each, covering zoning regulations, cost breakdowns, risk assessments, construction schemes, timelines, and financial analysis.

**The problem**: Raw LLM output is a wall of text. Even well-structured markdown is hard to navigate when it's 400+ lines covering 8+ specialized topics. Property owners, contractors, and investors need to quickly find what matters to *their* specific property.

**The solution**: A component-based MDX rendering pipeline that transforms structured report data into an interactive, navigable document with:
- Sidebar tab navigation for instant section jumping
- Data-driven visual components (charts, badges, progress rings)
- Personalized alert prominence based on property-specific risk factors
- A visual language inspired by McKinsey/Deloitte consulting reports

---

## Architecture Overview

```
MDX Source File (data/reports/*.mdx)
  |  Pre-authored with JSX components inline
  v
Next.js Server Component (app/report/[slug]/page.tsx)
  |  Reads .mdx file from disk via fs
  v
MDXRenderer (client component)
  |  @mdx-js/mdx evaluate() — compiles MDX to React at runtime
  |  Injects custom components via useMDXComponents()
  v
ReportLayout (client component)
  |  DOM-based section grouping via MutationObserver
  |  Manages active section state + visibility toggling
  v
  +-- ReportSidebar (sticky left, 220px)
  +-- Report Content (right, scrollable)
        |-- Overview: FeasibilityBadge, PropertySnapshot, StatRow, OverlayGrid, KeyAlerts
        |-- Section 1..N: SectionHeading + prose + data components
```

### Why runtime MDX compilation?

We use `@mdx-js/mdx`'s `evaluate()` to compile MDX in the browser rather than at build time. This allows:
1. Reports to be loaded dynamically from any source (filesystem, database, API)
2. Zero build step when adding new reports — just drop an `.mdx` file
3. Hot reload during development

The trade-off is a brief (~200ms) compilation delay on first render, handled by a loading state.

### Why DOM-based section navigation?

We considered three approaches for section navigation:

| Approach | Verdict |
|----------|---------|
| **A. React Context + Portals** | Too complex, React 19 Strict Mode double-fire issues |
| **B. Split MDX at section boundaries** | Breaks cross-line JSX expressions and shared MDX scope |
| **C. DOM scanning + visibility toggle** | Simple, works with any MDX structure, zero MDX format changes |

We chose **Option C**: After MDX renders into the DOM, a `MutationObserver` scans for `[data-section-id]` markers emitted by `<SectionHeading>`. It groups all DOM elements between markers into sections, then toggles `display: none/block` when the user switches tabs.

---

## Design Philosophy

### Consulting Report Aesthetic

The visual language draws from premium consulting deliverables (McKinsey, Deloitte, BCG):

- **Restrained color palette**: Warm off-white background (`#FAFAF7`), navy accents (`#1B3A5C`), semantic colors only for status (red/amber/green)
- **Typography hierarchy**: DM Sans for body text (clean, geometric), Instrument Serif for display headings and large numbers (editorial warmth)
- **Information density**: Small but legible font sizes (10-14px range), tight line heights, generous section spacing — packs information without feeling cramped
- **Visual consistency**: Every component uses the same border radius (`rounded-xl`), the same border treatment (`border-report-border-light`), the same label style (`text-[10px] font-bold uppercase tracking-[0.12em]`)

### Component Design Patterns

Every data component follows the same structural pattern:

```
Container (rounded-xl, border, bg-report-surface)
  |-- Header bar (bg-report-surface-alt, uppercase label)
  |-- Content area (consistent padding px-5 py-3-4)
  |-- Optional accent bar (absolute positioned, left or top edge)
```

Recurring micro-patterns:
- **Status indicator dot**: `h-2 w-2 rounded-full` with semantic color — appears in OverlayBadge, RiskList
- **Icon container**: `h-N w-N rounded-xl bg-{color}/10` with Lucide icon inside — appears in every component
- **Uppercase tracking label**: `text-[9-10px] font-bold uppercase tracking-[0.1-0.14em]` — section headers, category labels, badge text
- **Serif numbers**: `font-serif text-[20-24px] text-report-accent` — cost ranges, stat values, large callout numbers

### Personalization Through Visual Weight

Reports contain the same types of data (overlays, risks, costs) but the *importance* varies dramatically by property. A fire zone is critical in Mill Valley hills but irrelevant in flat San Jose. Our design philosophy: **data determines its own visual prominence**.

Three mechanisms:

1. **OverlayGrid**: Splits children by `status` prop. `negative` items become full-width red hero cards. `positive`/`neutral` items stay in a compact 3-column grid. Same MDX, different visual output.

2. **RiskList**: Three rendering tiers based on `level` prop. `high` = always-expanded hero cards with shield icon. `medium` = collapsible accordion (one open at a time). `low` = compact grouped list.

3. **KeyAlerts**: Explicit editorial curation in MDX. Five alert types (`danger`, `cost`, `advantage`, `tip`, `financial`) with distinct color/icon/size treatment. `danger` items get larger icons, thicker accent bars, bigger text.

---

## Design System

### Color Tokens (CSS Custom Properties)

All colors are defined in `app/globals.css` via Tailwind v4's `@theme inline` block:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-report-bg` | `#FAFAF7` | Page background (warm off-white) |
| `--color-report-surface` | `#FFFFFF` | Card/component backgrounds |
| `--color-report-surface-alt` | `#F5F3EF` | Alternating rows, header bars |
| `--color-report-border` | `#D9D6D0` | Strong borders (section dividers) |
| `--color-report-border-light` | `#EAEAE6` | Subtle borders (card edges) |
| `--color-report-text` | `#1A1A1A` | Primary text |
| `--color-report-text-secondary` | `#4A4A4A` | Body text, descriptions |
| `--color-report-text-tertiary` | `#8A8A8A` | Labels, captions, metadata |
| `--color-report-accent` | `#1B3A5C` | Navy — brand accent, links, highlights |
| `--color-report-accent-dark` | `#0F2440` | Hover state for accent |
| `--color-report-accent-light` | `#EDF2F7` | Light accent background |
| `--color-report-green` | `#15803D` | Positive / clear / done |
| `--color-report-green-bg` | `#F0FDF4` | Green tint background |
| `--color-report-amber` | `#A16207` | Warning / neutral / partial |
| `--color-report-amber-bg` | `#FFFBEB` | Amber tint background |
| `--color-report-red` | `#B91C1C` | Negative / danger / high risk |
| `--color-report-red-bg` | `#FEF2F2` | Red tint background |

### Typography

| Role | Font | Size | Weight | Tracking |
|------|------|------|--------|----------|
| Page title | Instrument Serif | 32px | normal | tight |
| Section heading | DM Sans | 11px | bold | 0.14em (uppercase) |
| Component header | DM Sans | 13-14px | bold | -0.01em |
| Body text | DM Sans | 13.5px | normal | — |
| Small labels | DM Sans | 9-10px | bold | 0.1-0.14em (uppercase) |
| Large numbers | Instrument Serif | 20-24px | normal | — |
| Monospace data | System mono | 10.5-11.5px | — | tabular-nums |

### Spacing

- Section gap: `mt-12 mb-6` (between `<SectionHeading>` blocks)
- Content rhythm: `> * + * { margin-top: 1.25rem }` (via `.report-content` CSS)
- Card internal padding: `px-5 py-3` to `px-5 py-4`
- Grid gaps: `gap-2.5` to `gap-3`

### Layout

- **Desktop** (>= 768px): CSS Grid, `220px sidebar + 1fr content`, `max-width: 960px`
- **Mobile** (< 768px): Single column, sidebar hidden, `max-width: 720px`, full scroll mode

---

## Component Reference

### Overview Components (shown in "Overview" tab)

#### `<FeasibilityBadge status="go|conditional|no-go" summary="...">`
Hero banner at the top of every report. Shows the overall verdict with a color-coded card (green/amber/red), large icon, and summary text. Decorative SVG corner pattern adds visual interest.

#### `<PropertySnapshot fields={[{label, value, span?}]}>`
Property details grid. First field becomes a navy hero bar (address). Remaining fields render in a 2-column grid with `gap-px` borders. Fields with `span: 2` take full width. Auto-expands lone fields in a row.

#### `<StatRow>` + `<StatCard label="..." value="..." sub="...">`
Four key metrics in a responsive grid (2-col on narrow, 4-col on wider). Each card has a gradient accent bar at top, serif large number, and optional subtitle.

#### `<OverlayGrid>` + `<OverlayBadge icon="..." label="..." value="..." status="positive|neutral|negative">`
**Personalized rendering**: `OverlayGrid` introspects its children via `React.Children.forEach`. `negative` items are extracted and rendered as full-width red hero cards with left accent bar, large icon, and bold label. Remaining items display in a compact 3-column badge grid. A summary bar shows the count distribution (Clear/Note/Flag) with a proportional color bar.

#### `<KeyAlerts alerts={[{type, title, description}]}>`
**Editorially curated** property-specific alerts. Five types:

| Type | Color | Icon | Badge Label | Visual Weight |
|------|-------|------|-------------|--------------|
| `danger` | Red | ShieldAlert | "Critical" | Large (14px title, w-1.5 accent bar, h-9 icon) |
| `cost` | Amber | CircleDollarSign | "Cost Alert" | Standard |
| `advantage` | Green | CheckCircle2 | "Advantage" | Standard |
| `tip` | Navy | Lightbulb | "Strategy" | Standard |
| `financial` | Navy | TrendingUp | "Financial" | Standard |

### Section Components

#### `<SectionHeading title="..." icon="...">`
Section divider with icon badge (navy rounded square + white Lucide icon), uppercase title, and an accent underline. Emits `data-section-id`, `data-section-title`, `data-section-icon` attributes used by the sidebar navigation system.

#### `<RiskList items={[{level, title, description}]}>`
**Three-tier rendering**:
- `high`: Always-expanded hero card with red background, ShieldAlert icon, "HIGH RISK" badge
- `medium`: Collapsible accordion cards with amber left border (only one open at a time)
- `low`: Compact grouped list under a single "N Low-Risk Items" collapsible

A severity summary bar at the top shows the distribution across all three tiers.

#### `<CostBreakdown title="..." items={[{name, low, high, note?}]} contingencyPercent={N}>`
Two-part cost display:
1. **Visual summary**: Total range in serif font + horizontal bar chart grouping line items into 5 categories (Permits, Professional Services, Site & Foundation, Construction, Other) with proportional bars
2. **Detailed table**: All line items with low/high estimates, alternating row colors, subtotal, amber contingency row, navy total row

Keyword-based auto-categorization groups 30+ line items into visual categories without requiring manual tagging.

#### `<SchemeComparison schemes={[{name, recommended?, description, specs, pros, cons, costRange, riskLevel?, bestFor?}]}>`
Side-by-side ADU design option cards. Recommended scheme gets a navy header banner with trophy icon and ring shadow. Each card includes:
- Specs grid (3-column, centered values)
- Risk badge (`riskLevel`: `"high"` red / `"medium"` amber / `"low"` green pill with shield icon)
- Pros/cons balance bar (proportional green/amber)
- Advantages list (green checkmarks) and Considerations list (amber triangles)
- "Best For" tag (`bestFor`: target icon + descriptive text for the ideal owner profile)
- Cost range footer in serif font

#### `<CostSavings items={[{name, low, high, condition}]}>`
Two-column savings visualization. Left: SVG donut chart with proportional segments (colors cycle through green, accent, amber, red) and center total range. Right: itemized savings list with colored checkmark icons, name, savings range in serif green, and condition text. Header matches the standard component pattern (sparkle icon + uppercase label).

#### `<ComparisonTable headers={[...]} rows={[...]} highlightColumn={N}>`
Data comparison table with optional column highlighting (star icon + accent background). Alternating row colors, uppercase header labels, bordered container.

#### `<ChecklistProgress items={[{status, label}]}>`
Progress checklist with SVG progress ring (animated `stroke-dasharray`). Three states: `done` (green filled circle + white check), `partial` (amber triangle), `pending` (grey outline circle).

#### `<Callout type="info|warning|success|danger" title="...">`
Styled alert box with left accent bar, icon in tinted background, bold title, and children content. Four color variants.

#### `<TimelineStep step="1" title="..." duration="...">`
Vertical timeline with connected dot/line. Step numbers in navy-bordered circles; "Completed" steps show green check. Duration badge next to title. Content card with border.

#### `<CollapsibleSection title="..." defaultOpen={false}>`
Generic expand/collapse container with Layers icon and chevron animation.

#### `<OpportunityList items={[{title, description}]}>`
Stacked list of positive items with green Lightbulb icons.

#### `<ContactCard contacts={[{category, department, phone?, email?, website?}]}>`
Contact information cards with Building2 icon, category badge, and clickable phone/email/website links.

#### `<SourceList>` + `<Source id="..." label="..." url="...">`
Numbered reference list with numbered badges and external link icons.

#### `<CitationRef id="...">`
Inline citation marker (superscript link to source).

---

## Sidebar Navigation System

### How It Works

1. **MDX renders** into a flat list of DOM elements inside `.report-content`
2. `ReportLayout` uses a `MutationObserver` to detect when rendering completes
3. It scans for all elements with `[data-section-id]` attributes (emitted by `<SectionHeading>`)
4. Elements before the first marker = "Overview" group
5. Each marker + all siblings until the next marker = one section group
6. Switching tabs sets `display: none` on all elements not in the active group

### Sidebar Features

- **Progress indicator**: Shows `N / Total` with a filled progress bar
- **Icon + short title**: Icons from icon-map, titles auto-shortened (strips numbering, parentheticals, and takes first 3 words if still too long)
- **Keyboard navigation**: ArrowUp/ArrowDown to move between tabs
- **Active state**: Navy left border + accent background on the active tab
- **Section fade-in**: CSS `@keyframes sectionFadeIn` with `opacity + translateY` animation

### Responsive Behavior

Below 768px, the sidebar hides entirely and the report becomes a single scrollable page. The grid collapses from `220px + 1fr` to `1fr`.

---

## Data-Driven Personalization

The core design insight: **the same data schema renders differently based on what's important for each property**. No special flags or overrides needed — the components read their existing props and adjust visual weight automatically.

### Example: OverlayGrid

Given this identical MDX pattern across reports:

```jsx
<OverlayGrid>
  <OverlayBadge icon="flame" label="Fire Zone" value="Yes" status="negative" />
  <OverlayBadge icon="mountain" label="Hillside" value="No" status="positive" />
  ...
</OverlayGrid>
```

- **LA City (3 negative items)**: 3 full-width red hero cards + 6 compact badges
- **San Jose (0 negative items)**: No hero cards, all 9 compact green badges
- **Mill Valley (2 negative items)**: 2 red hero cards + 7 compact badges

### Example: RiskList

Same component, different data, different rendering:

- **Mill Valley**: 2 HIGH hero cards (Steep Hillside, WUI Fire Zone) + 4 MEDIUM collapsible + 2 LOW grouped
- **San Jose**: 1 HIGH hero card (Lot Coverage) + 5 MEDIUM collapsible + 2 LOW grouped
- **LA City**: 2 HIGH hero cards (Fault Zone, Fire Zone) + 3 MEDIUM + 3 LOW grouped

### Example: KeyAlerts

Fully editorial — each report's `<KeyAlerts>` is manually curated with the 6 most important items for that specific property:

- **LA City**: Leads with two `danger` alerts (earthquake fault, fire zone), followed by cost/advantage/tip/financial
- **San Jose**: Leads with `advantage` alerts (zero hazards, 200A panel), then financial/tip items
- **Mill Valley**: Leads with `danger` alerts (43.9% slope, fire zone), heavy on cost warnings

---

## MDX Authoring Guide

### Report Structure Template

```mdx
{/* ===== OVERVIEW AREA (before first SectionHeading) ===== */}
<FeasibilityBadge status="go|conditional|no-go" summary="..." />

<PropertySnapshot fields={[
  { label: "Address", value: "...", span: 2 },
  { label: "Zoning", value: "..." },
  ...
]} />

<StatRow>
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
</StatRow>

<OverlayGrid>
  <OverlayBadge icon="..." label="..." value="..." status="positive|neutral|negative" />
  ...
</OverlayGrid>

<KeyAlerts alerts={[
  { type: "danger|cost|advantage|tip|financial", title: "...", description: "..." },
  ...
]} />

{/* ===== SECTIONS (each starts a new sidebar tab) ===== */}
<SectionHeading title="1. Section Name" icon="landmark" />

Regular markdown text, **bold**, *italic*, lists, etc.

<CostBreakdown title="..." items={[...]} contingencyPercent={15} />

<SectionHeading title="2. Next Section" icon="shield" />
...
```

### Available Icons

Icons are string identifiers mapped to Lucide React components in `lib/icon-map.ts`:

`mountain`, `landmark`, `building`, `flame`, `droplet`, `pipette`, `train`, `ruler`, `map-pin`, `clipboard`, `triangle-alert`, `home`, `circle-dollar-sign`, `calendar`, `key`, `scroll`, `help-circle`, `shield`, `zap`, `tree-pine`, `globe`, `file-text`, `scale`, `hammer`, `truck`, `wrench`, `users`, `phone`, `mail`, `book-open`, `target`, `trending-up`, `bar-chart`, `pie-chart`

### Markdown Overrides

Standard markdown elements are restyled for the report context:
- `# H1` — Instrument Serif, 32px
- `## H2` — Instrument Serif, 22px
- `### H3` — DM Sans, 15px semibold
- `p` — 13.5px, secondary color, 1.75 line height
- `a` — Navy accent, underline on hover
- `ul/ol` — Subtle tertiary-colored markers
- `blockquote` — Navy left border, italic
- `hr` — Full-width border, generous vertical margin

---

## Adding a New Report

1. Create a new `.mdx` file in `data/reports/` following the naming convention: `{city}-{street-number}-{street-name}.mdx` (e.g., `sf-123-main-st.mdx`)

2. Add metadata to `app/report/page.tsx` in the `REPORT_META` object:
   ```ts
   "sf-123-main-st": { label: "123 Main St, San Francisco, CA 94105", city: "San Francisco" },
   ```

3. Write the MDX content following the [Report Structure Template](#report-structure-template) above

4. The report will automatically appear in the index page and be accessible at `/report/sf-123-main-st`

No build step required — Next.js picks up new files on the next request.

---

## File Map

```
report-viewer/
├── app/
│   ├── globals.css              # Design system tokens + layout CSS
│   ├── layout.tsx               # Root layout (Google Fonts: DM Sans, Instrument Serif)
│   ├── page.tsx                 # Landing redirect
│   ├── report/
│   │   ├── page.tsx             # Report index (lists all available reports)
│   │   └── [slug]/page.tsx      # Dynamic report page (reads .mdx from disk)
│   └── test/page.tsx            # Dev testing page (optional)
│
├── components/
│   ├── mdx-components.tsx       # Component registry (maps JSX tags to React components)
│   ├── mdx-renderer.tsx         # Client-side MDX compiler (evaluate() from @mdx-js/mdx)
│   ├── report-layout.tsx        # Two-column grid + DOM section grouping logic
│   ├── report-sidebar.tsx       # Sticky sidebar with tab navigation
│   └── report/                  # All report-specific data components
│       ├── feasibility-badge.tsx
│       ├── property-snapshot.tsx
│       ├── stat-row.tsx
│       ├── overlay-grid.tsx     # Smart: splits negative items into hero cards
│       ├── key-alerts.tsx       # Editorially curated property alerts
│       ├── section-heading.tsx  # Emits data-section-* for sidebar navigation
│       ├── risk-list.tsx        # Tiered: high=hero, medium=accordion, low=compact
│       ├── cost-breakdown.tsx   # Auto-categorized bar chart + detailed table
│       ├── scheme-comparison.tsx # ADU design option cards with risk badge + best for
│       ├── cost-savings.tsx    # SVG donut chart + savings items list
│       ├── comparison-table.tsx
│       ├── checklist-progress.tsx # SVG progress ring + status list
│       ├── callout.tsx
│       ├── timeline-step.tsx
│       ├── collapsible-section.tsx
│       ├── opportunity-list.tsx
│       ├── contact-card.tsx
│       ├── source-list.tsx
│       └── citation-ref.tsx
│
├── lib/
│   ├── report-types.ts          # TypeScript interfaces for all components
│   ├── icon-map.ts              # String → Lucide icon resolver
│   └── section-utils.ts         # slugify(), parseShortTitle(), SectionInfo type
│
├── data/
│   └── reports/                 # MDX report files (the actual content)
│       ├── la-city-3982-s-orange.mdx
│       ├── san-jose-5962-royal-ann.mdx
│       └── mill-valley-100-marlin.mdx
│
├── package.json                 # Dependencies (zero API keys needed)
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router + Turbopack) | 16.1.6 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS (v4, CSS-first config) | 4.x |
| MDX | @mdx-js/mdx (runtime evaluate) | 3.1.1 |
| Icons | lucide-react | 0.564.0 |
| Language | TypeScript | 5.x |
| Screenshots | Playwright (devDependency only) | 1.58.2 |

---

## Known Limitations & Future Work

### Current Limitations

- **No server-side MDX compilation**: MDX is compiled in the browser via `evaluate()`. This adds ~200ms on first load but enables dynamic report loading without build steps.
- **Single-report view only**: No side-by-side comparison between properties.
- **Static report data**: Reports are `.mdx` files on disk. No real-time data fetching or updates.
- **No print/PDF export**: The viewer is web-only. PDF generation is handled by the backend pipeline (Playwright + pypdf), not this viewer.
- **English only**: Reports are in English. The backend supports translations via GPT, but the viewer has no language switcher.

### Potential Enhancements

- [ ] Animated section transitions (cross-fade instead of show/hide)
- [ ] Table of contents within each section for long sections
- [ ] Cost comparison charts (selected scheme vs. total budget)
- [ ] Interactive financial calculator (adjust rent, vacancy, appreciation)
- [ ] Mobile bottom sheet navigation (instead of hiding sidebar entirely)
- [ ] Dark mode theme variant
- [ ] Report sharing via URL with section deep-links

---

---

# ADU 可行性报告查看器

基于 **Next.js 16 + React 19 + Tailwind CSS v4 + MDX** 构建的咨询级交互式报告查看器。将 AI 生成的 ADU（附属住宅单元）可行性报告渲染为精美、可导航的网页文档。

**在线演示**：`npm run dev` 然后打开 `http://localhost:3000/report`

---

## 目录

- [快速启动](#快速启动)
- [项目背景](#项目背景)
- [架构概览](#架构概览)
- [设计理念](#设计理念)
- [设计系统](#设计系统)
- [组件参考](#组件参考)
- [侧边栏导航系统](#侧边栏导航系统)
- [数据驱动的个性化](#数据驱动的个性化)
- [MDX 编写指南](#mdx-编写指南)
- [添加新报告](#添加新报告)
- [文件目录](#文件目录)
- [技术栈](#技术栈)
- [已知局限与未来规划](#已知局限与未来规划)

---

## 快速启动

```bash
# 前置条件：Node.js 18+
npm install
npm run dev
# 打开 http://localhost:3000/report
```

无需 API 密钥、无需 `.env`、无需后端服务。一切自包含。

---

## 项目背景

本查看器是一个更大的 ADU 研究平台的一部分，该平台使用 OpenAI 的 o3-deep-research 为加州房产生成全面的可行性报告。每份报告约 15,000-20,000 字，涵盖区划法规、成本明细、风险评估、建设方案、时间线和财务分析。

**问题**：原始 LLM 输出是一堵文字墙。即使是结构良好的 Markdown，当它有 400+ 行、覆盖 8+ 个专业主题时也很难浏览。业主、承包商和投资者需要快速找到对*他们特定房产*重要的信息。

**解决方案**：一个基于组件的 MDX 渲染管线，将结构化报告数据转化为交互式、可导航的文档：
- 侧边栏标签导航，实现章节间即时跳转
- 数据驱动的可视化组件（图表、徽章、进度环）
- 基于房产特定风险因素的个性化警示突出显示
- 灵感来自 McKinsey/Deloitte 咨询报告的视觉语言

---

## 架构概览

```
MDX 源文件 (data/reports/*.mdx)
  |  预先编写，内联 JSX 组件
  v
Next.js 服务端组件 (app/report/[slug]/page.tsx)
  |  通过 fs 从磁盘读取 .mdx 文件
  v
MDXRenderer (客户端组件)
  |  @mdx-js/mdx evaluate() — 运行时将 MDX 编译为 React
  |  通过 useMDXComponents() 注入自定义组件
  v
ReportLayout (客户端组件)
  |  基于 DOM 的章节分组，使用 MutationObserver
  |  管理活动章节状态 + 可见性切换
  v
  +-- ReportSidebar (左侧固定, 220px)
  +-- 报告内容 (右侧, 可滚动)
        |-- 概览: FeasibilityBadge, PropertySnapshot, StatRow, OverlayGrid, KeyAlerts
        |-- 章节 1..N: SectionHeading + 正文 + 数据组件
```

### 为什么使用运行时 MDX 编译？

我们使用 `@mdx-js/mdx` 的 `evaluate()` 在浏览器中编译 MDX，而不是在构建时编译。这允许：
1. 从任何来源（文件系统、数据库、API）动态加载报告
2. 添加新报告时无需构建步骤 — 只需放入一个 `.mdx` 文件
3. 开发时支持热重载

代价是首次渲染时有约 200ms 的编译延迟，通过加载状态来处理。

### 为什么使用基于 DOM 的章节导航？

我们考虑了三种章节导航方案：

| 方案 | 结论 |
|------|------|
| **A. React Context + Portals** | 过于复杂，React 19 严格模式下有双重触发问题 |
| **B. 在章节边界拆分 MDX** | 会破坏跨行 JSX 表达式和共享的 MDX 作用域 |
| **C. DOM 扫描 + 可见性切换** | 简单，适用于任何 MDX 结构，无需改变 MDX 格式 |

我们选择了 **方案 C**：MDX 渲染到 DOM 后，`MutationObserver` 扫描由 `<SectionHeading>` 发出的 `[data-section-id]` 标记。它将标记之间的所有 DOM 元素分组为章节，然后在用户切换标签时切换 `display: none/block`。

---

## 设计理念

### 咨询报告美学

视觉语言借鉴了顶级咨询公司的交付物（McKinsey、Deloitte、BCG）：

- **克制的配色方案**：温暖的米白背景 (`#FAFAF7`)，海军蓝强调色 (`#1B3A5C`)，语义颜色仅用于状态指示（红/琥珀/绿）
- **排版层次**：DM Sans 用于正文（干净、几何感），Instrument Serif 用于展示标题和大数字（编辑质感的温暖感）
- **信息密度**：小但清晰的字号（10-14px 范围），紧凑的行高，慷慨的章节间距 — 在不显拥挤的情况下压缩信息
- **视觉一致性**：每个组件使用相同的圆角 (`rounded-xl`)、相同的边框处理 (`border-report-border-light`)、相同的标签样式 (`text-[10px] font-bold uppercase tracking-[0.12em]`)

### 组件设计模式

每个数据组件遵循相同的结构模式：

```
容器 (rounded-xl, border, bg-report-surface)
  |-- 头部栏 (bg-report-surface-alt, 大写标签)
  |-- 内容区域 (一致的内边距 px-5 py-3-4)
  |-- 可选的强调条 (绝对定位, 左边或顶部边缘)
```

重复出现的微观模式：
- **状态指示点**：`h-2 w-2 rounded-full` 配语义颜色 — 出现在 OverlayBadge、RiskList 中
- **图标容器**：`h-N w-N rounded-xl bg-{color}/10` 内含 Lucide 图标 — 出现在每个组件中
- **大写间距标签**：`text-[9-10px] font-bold uppercase tracking-[0.1-0.14em]` — 章节标题、类别标签、徽章文字
- **衬线体数字**：`font-serif text-[20-24px] text-report-accent` — 成本范围、统计值、大号标注数字

### 通过视觉权重实现个性化

报告包含相同类型的数据（叠加图层、风险、成本），但*重要性*因房产而异。火灾区域在 Mill Valley 山区至关重要，但在平坦的 San Jose 无关紧要。我们的设计理念：**数据决定自身的视觉突出程度**。

三个机制：

1. **OverlayGrid**：根据 `status` 属性拆分子元素。`negative` 项变为全宽红色主卡片。`positive`/`neutral` 项保持紧凑的 3 列网格。相同的 MDX，不同的视觉输出。

2. **RiskList**：根据 `level` 属性的三级渲染。`high` = 始终展开的主卡片，带盾牌图标。`medium` = 可折叠手风琴（同时只开一个）。`low` = 紧凑分组列表。

3. **KeyAlerts**：MDX 中的明确编辑策划。五种警报类型（`danger`、`cost`、`advantage`、`tip`、`financial`），各有不同的颜色/图标/尺寸处理。`danger` 项获得更大的图标、更粗的强调条、更大的文字。

---

## 设计系统

### 颜色令牌（CSS 自定义属性）

所有颜色在 `app/globals.css` 中通过 Tailwind v4 的 `@theme inline` 块定义：

| 令牌 | 值 | 用途 |
|------|-------|------|
| `--color-report-bg` | `#FAFAF7` | 页面背景（温暖米白） |
| `--color-report-surface` | `#FFFFFF` | 卡片/组件背景 |
| `--color-report-surface-alt` | `#F5F3EF` | 交替行、头部栏 |
| `--color-report-border` | `#D9D6D0` | 强边框（章节分隔线） |
| `--color-report-border-light` | `#EAEAE6` | 柔和边框（卡片边缘） |
| `--color-report-text` | `#1A1A1A` | 主文本 |
| `--color-report-text-secondary` | `#4A4A4A` | 正文、描述 |
| `--color-report-text-tertiary` | `#8A8A8A` | 标签、说明文字、元数据 |
| `--color-report-accent` | `#1B3A5C` | 海军蓝 — 品牌强调色、链接、高亮 |
| `--color-report-accent-dark` | `#0F2440` | 强调色的悬停状态 |
| `--color-report-accent-light` | `#EDF2F7` | 浅色强调背景 |
| `--color-report-green` | `#15803D` | 正面 / 通过 / 完成 |
| `--color-report-green-bg` | `#F0FDF4` | 绿色底色背景 |
| `--color-report-amber` | `#A16207` | 警告 / 中性 / 部分完成 |
| `--color-report-amber-bg` | `#FFFBEB` | 琥珀色底色背景 |
| `--color-report-red` | `#B91C1C` | 负面 / 危险 / 高风险 |
| `--color-report-red-bg` | `#FEF2F2` | 红色底色背景 |

### 排版

| 角色 | 字体 | 大小 | 字重 | 字间距 |
|------|------|------|------|--------|
| 页面标题 | Instrument Serif | 32px | normal | tight |
| 章节标题 | DM Sans | 11px | bold | 0.14em（大写） |
| 组件头部 | DM Sans | 13-14px | bold | -0.01em |
| 正文 | DM Sans | 13.5px | normal | — |
| 小标签 | DM Sans | 9-10px | bold | 0.1-0.14em（大写） |
| 大号数字 | Instrument Serif | 20-24px | normal | — |
| 等宽数据 | 系统等宽字体 | 10.5-11.5px | — | tabular-nums |

### 间距

- 章节间距：`mt-12 mb-6`（`<SectionHeading>` 块之间）
- 内容节奏：`> * + * { margin-top: 1.25rem }`（通过 `.report-content` CSS）
- 卡片内部边距：`px-5 py-3` 到 `px-5 py-4`
- 网格间距：`gap-2.5` 到 `gap-3`

### 布局

- **桌面端**（>= 768px）：CSS Grid，`220px 侧边栏 + 1fr 内容`，`max-width: 960px`
- **移动端**（< 768px）：单列，侧边栏隐藏，`max-width: 720px`，全页滚动模式

---

## 组件参考

### 概览组件（显示在"Overview"标签中）

#### `<FeasibilityBadge status="go|conditional|no-go" summary="...">`
每份报告顶部的主横幅。用颜色编码的卡片（绿/琥珀/红）、大图标和摘要文字显示整体评估结果。装饰性 SVG 角落图案增加视觉趣味。

#### `<PropertySnapshot fields={[{label, value, span?}]}>`
房产详情网格。第一个字段变为海军蓝主横幅（地址）。其余字段以 2 列网格渲染，使用 `gap-px` 边框。带 `span: 2` 的字段占满整行。自动扩展行中孤立的字段。

#### `<StatRow>` + `<StatCard label="..." value="..." sub="...">`
四个关键指标，响应式网格布局（窄屏 2 列，宽屏 4 列）。每张卡片顶部有渐变强调条，衬线体大号数字，可选副标题。

#### `<OverlayGrid>` + `<OverlayBadge icon="..." label="..." value="..." status="positive|neutral|negative">`
**个性化渲染**：`OverlayGrid` 通过 `React.Children.forEach` 内省子元素。`negative` 项被提取并渲染为全宽红色主卡片，带左侧强调条、大图标和粗体标签。其余项显示在紧凑的 3 列徽章网格中。摘要栏显示分布统计（Clear/Note/Flag）和比例颜色条。

#### `<KeyAlerts alerts={[{type, title, description}]}>`
**编辑策划的**房产特定警报。五种类型：

| 类型 | 颜色 | 图标 | 徽章标签 | 视觉权重 |
|------|------|------|---------|---------|
| `danger` | 红 | ShieldAlert | "Critical" | 大号（14px 标题, w-1.5 强调条, h-9 图标） |
| `cost` | 琥珀 | CircleDollarSign | "Cost Alert" | 标准 |
| `advantage` | 绿 | CheckCircle2 | "Advantage" | 标准 |
| `tip` | 海军蓝 | Lightbulb | "Strategy" | 标准 |
| `financial` | 海军蓝 | TrendingUp | "Financial" | 标准 |

### 章节组件

#### `<SectionHeading title="..." icon="...">`
章节分隔线，带图标徽章（海军蓝圆角方块 + 白色 Lucide 图标）、大写标题和强调下划线。发出 `data-section-id`、`data-section-title`、`data-section-icon` 属性，供侧边栏导航系统使用。

#### `<RiskList items={[{level, title, description}]}>`
**三级渲染**：
- `high`：始终展开的主卡片，红色背景，盾牌图标，"HIGH RISK"徽章
- `medium`：可折叠手风琴卡片，琥珀色左边框（同时只能打开一个）
- `low`：紧凑分组列表，在一个"N 个低风险项"可折叠容器下

顶部的严重性摘要栏显示三个级别的分布。

#### `<CostBreakdown title="..." items={[{name, low, high, note?}]} contingencyPercent={N}>`
两部分成本展示：
1. **视觉摘要**：衬线体字体显示总范围 + 水平柱状图，将明细项自动归类为 5 个类别（许可费、专业服务、场地与基础、建设、其他），按比例显示柱状条
2. **详细表格**：所有明细项的高低估算，交替行颜色，小计，琥珀色应急金行，海军蓝总计行

基于关键词的自动分类将 30+ 个明细项归入视觉类别，无需手动标记。

#### `<SchemeComparison schemes={[{name, recommended?, description, specs, pros, cons, costRange, riskLevel?, bestFor?}]}>`
ADU 设计方案并排卡片。推荐方案获得海军蓝头部横幅，带奖杯图标和环形阴影。每张卡片包括：
- 规格网格（3 列，居中值）
- 风险徽章（`riskLevel`：`"high"` 红 / `"medium"` 琥珀 / `"low"` 绿色药丸标签，带盾牌图标）
- 优缺点平衡条（比例绿/琥珀）
- 优势列表（绿色对勾）和考虑因素列表（琥珀三角）
- "Best For" 标签（`bestFor`：靶心图标 + 描述理想业主画像的文字）
- 衬线体字体的成本范围页脚

#### `<CostSavings items={[{name, low, high, condition}]}>`
双列省钱可视化组件。左侧：SVG 甜甜圈图，按比例显示各项节省（颜色依次为绿、蓝、琥珀、红），中心显示总节省范围。右侧：逐项节省清单，带彩色对勾图标、名称、衬线体绿色金额范围和条件说明。头部遵循标准组件模式（闪光图标 + 大写标签）。

#### `<ComparisonTable headers={[...]} rows={[...]} highlightColumn={N}>`
数据对比表，支持可选的列高亮（星形图标 + 强调背景）。交替行颜色，大写表头标签，带边框容器。

#### `<ChecklistProgress items={[{status, label}]}>`
进度清单，带 SVG 进度环（动画 `stroke-dasharray`）。三种状态：`done`（绿色实心圆 + 白色对勾）、`partial`（琥珀三角）、`pending`（灰色空心圆）。

#### `<Callout type="info|warning|success|danger" title="...">`
样式化提示框，带左侧强调条、着色背景中的图标、粗体标题和子内容。四种颜色变体。

#### `<TimelineStep step="1" title="..." duration="...">`
垂直时间线，带连接的圆点/线条。步骤编号在海军蓝边框圆圈中；"Completed"步骤显示绿色对勾。标题旁的时长徽章。带边框的内容卡片。

#### `<CollapsibleSection title="..." defaultOpen={false}>`
通用展开/折叠容器，带图层图标和箭头动画。

#### `<OpportunityList items={[{title, description}]}>`
带绿色灯泡图标的正面项目堆叠列表。

#### `<ContactCard contacts={[{category, department, phone?, email?, website?}]}>`
联系信息卡片，带建筑图标、类别徽章和可点击的电话/邮件/网站链接。

#### `<SourceList>` + `<Source id="..." label="..." url="...">`
编号参考列表，带数字徽章和外部链接图标。

#### `<CitationRef id="...">`
行内引用标记（上标链接到来源）。

---

## 侧边栏导航系统

### 工作原理

1. **MDX 渲染**为 `.report-content` 内的平面 DOM 元素列表
2. `ReportLayout` 使用 `MutationObserver` 检测渲染完成
3. 扫描所有带 `[data-section-id]` 属性的元素（由 `<SectionHeading>` 发出）
4. 第一个标记之前的元素 = "Overview"组
5. 每个标记 + 到下一个标记之间的所有兄弟元素 = 一个章节组
6. 切换标签时对不在活动组中的所有元素设置 `display: none`

### 侧边栏功能

- **进度指示器**：显示 `N / 总数` 和填充进度条
- **图标 + 简短标题**：图标来自 icon-map，标题自动缩短（去除编号、括号内容，超长时取前 3 个词）
- **键盘导航**：上下箭头键在标签间移动
- **活动状态**：活动标签上的海军蓝左边框 + 强调背景
- **章节淡入**：CSS `@keyframes sectionFadeIn`，`opacity + translateY` 动画

### 响应式行为

768px 以下，侧边栏完全隐藏，报告变为单列可滚动页面。网格从 `220px + 1fr` 折叠为 `1fr`。

---

## 数据驱动的个性化

核心设计洞察：**相同的数据结构根据每个房产的重要程度渲染出不同的效果**。不需要特殊标志或覆盖 — 组件读取现有的 props 并自动调整视觉权重。

### 示例：OverlayGrid

给定报告间相同的 MDX 模式：

```jsx
<OverlayGrid>
  <OverlayBadge icon="flame" label="Fire Zone" value="Yes" status="negative" />
  <OverlayBadge icon="mountain" label="Hillside" value="No" status="positive" />
  ...
</OverlayGrid>
```

- **LA City（3 个 negative 项）**：3 个全宽红色主卡片 + 6 个紧凑徽章
- **San Jose（0 个 negative 项）**：无主卡片，全部 9 个紧凑绿色徽章
- **Mill Valley（2 个 negative 项）**：2 个红色主卡片 + 7 个紧凑徽章

### 示例：RiskList

相同组件，不同数据，不同渲染：

- **Mill Valley**：2 个 HIGH 主卡片（陡坡、WUI 火灾区）+ 4 个 MEDIUM 可折叠 + 2 个 LOW 分组
- **San Jose**：1 个 HIGH 主卡片（地块覆盖率）+ 5 个 MEDIUM 可折叠 + 2 个 LOW 分组
- **LA City**：2 个 HIGH 主卡片（断层带、火灾区）+ 3 个 MEDIUM + 3 个 LOW 分组

### 示例：KeyAlerts

完全编辑策划 — 每份报告的 `<KeyAlerts>` 手动策划了该特定房产最重要的 6 个项目：

- **LA City**：以两个 `danger` 警报开头（地震断层、火灾区），后跟 cost/advantage/tip/financial
- **San Jose**：以 `advantage` 警报开头（零自然灾害、200A 面板），然后是 financial/tip 项
- **Mill Valley**：以 `danger` 警报开头（43.9% 坡度、火灾区），偏重成本警告

---

## MDX 编写指南

### 报告结构模板

```mdx
{/* ===== 概览区域（在第一个 SectionHeading 之前） ===== */}
<FeasibilityBadge status="go|conditional|no-go" summary="..." />

<PropertySnapshot fields={[
  { label: "Address", value: "...", span: 2 },
  { label: "Zoning", value: "..." },
  ...
]} />

<StatRow>
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
  <StatCard label="..." value="..." sub="..." />
</StatRow>

<OverlayGrid>
  <OverlayBadge icon="..." label="..." value="..." status="positive|neutral|negative" />
  ...
</OverlayGrid>

<KeyAlerts alerts={[
  { type: "danger|cost|advantage|tip|financial", title: "...", description: "..." },
  ...
]} />

{/* ===== 章节（每个开始一个新的侧边栏标签） ===== */}
<SectionHeading title="1. 章节名称" icon="landmark" />

普通 Markdown 文本，**粗体**，*斜体*，列表等。

<CostBreakdown title="..." items={[...]} contingencyPercent={15} />

<SectionHeading title="2. 下一章节" icon="shield" />
...
```

### 可用图标

图标是字符串标识符，在 `lib/icon-map.ts` 中映射到 Lucide React 组件：

`mountain`, `landmark`, `building`, `flame`, `droplet`, `pipette`, `train`, `ruler`, `map-pin`, `clipboard`, `triangle-alert`, `home`, `circle-dollar-sign`, `calendar`, `key`, `scroll`, `help-circle`, `shield`, `zap`, `tree-pine`, `globe`, `file-text`, `scale`, `hammer`, `truck`, `wrench`, `users`, `phone`, `mail`, `book-open`, `target`, `trending-up`, `bar-chart`, `pie-chart`

### Markdown 覆盖

标准 Markdown 元素为报告上下文重新样式化：
- `# H1` — Instrument Serif, 32px
- `## H2` — Instrument Serif, 22px
- `### H3` — DM Sans, 15px 半粗体
- `p` — 13.5px, 次要颜色, 1.75 行高
- `a` — 海军蓝强调色, 悬停时下划线
- `ul/ol` — 柔和的第三级颜色标记符
- `blockquote` — 海军蓝左边框, 斜体
- `hr` — 全宽边框, 慷慨的垂直间距

---

## 添加新报告

1. 在 `data/reports/` 中创建新的 `.mdx` 文件，遵循命名规范：`{城市}-{门牌号}-{街道名}.mdx`（例如 `sf-123-main-st.mdx`）

2. 在 `app/report/page.tsx` 的 `REPORT_META` 对象中添加元数据：
   ```ts
   "sf-123-main-st": { label: "123 Main St, San Francisco, CA 94105", city: "San Francisco" },
   ```

3. 按照上面的[报告结构模板](#报告结构模板)编写 MDX 内容

4. 报告将自动出现在索引页面中，并可通过 `/report/sf-123-main-st` 访问

无需构建步骤 — Next.js 在下次请求时自动识别新文件。

---

## 文件目录

```
report-viewer/
├── app/
│   ├── globals.css              # 设计系统令牌 + 布局 CSS
│   ├── layout.tsx               # 根布局（Google Fonts: DM Sans, Instrument Serif）
│   ├── page.tsx                 # 首页重定向
│   ├── report/
│   │   ├── page.tsx             # 报告索引（列出所有可用报告）
│   │   └── [slug]/page.tsx      # 动态报告页面（从磁盘读取 .mdx）
│   └── test/page.tsx            # 开发测试页面（可选）
│
├── components/
│   ├── mdx-components.tsx       # 组件注册表（将 JSX 标签映射到 React 组件）
│   ├── mdx-renderer.tsx         # 客户端 MDX 编译器（@mdx-js/mdx 的 evaluate()）
│   ├── report-layout.tsx        # 双列网格 + DOM 章节分组逻辑
│   ├── report-sidebar.tsx       # 固定侧边栏，标签导航
│   └── report/                  # 所有报告专用的数据组件
│       ├── feasibility-badge.tsx   # 可行性评估主横幅
│       ├── property-snapshot.tsx   # 房产详情网格
│       ├── stat-row.tsx            # 关键指标卡片行
│       ├── overlay-grid.tsx        # 智能：将 negative 项拆分为主卡片
│       ├── key-alerts.tsx          # 编辑策划的房产警报
│       ├── section-heading.tsx     # 发出 data-section-* 供侧边栏导航使用
│       ├── risk-list.tsx           # 分级：high=主卡片, medium=手风琴, low=紧凑
│       ├── cost-breakdown.tsx      # 自动分类柱状图 + 详细表格
│       ├── scheme-comparison.tsx   # ADU 设计方案卡片，含风险徽章 + 适用场景
│       ├── cost-savings.tsx        # SVG 甜甜圈图 + 省钱项目清单
│       ├── comparison-table.tsx    # 数据对比表
│       ├── checklist-progress.tsx  # SVG 进度环 + 状态列表
│       ├── callout.tsx             # 提示/警告框
│       ├── timeline-step.tsx       # 垂直时间线步骤
│       ├── collapsible-section.tsx # 通用可折叠容器
│       ├── opportunity-list.tsx    # 机遇列表
│       ├── contact-card.tsx        # 联系信息卡片
│       ├── source-list.tsx         # 参考来源列表
│       └── citation-ref.tsx        # 行内引用标记
│
├── lib/
│   ├── report-types.ts          # 所有组件的 TypeScript 接口
│   ├── icon-map.ts              # 字符串 → Lucide 图标解析器
│   └── section-utils.ts         # slugify()、parseShortTitle()、SectionInfo 类型
│
├── data/
│   └── reports/                 # MDX 报告文件（实际内容）
│       ├── la-city-3982-s-orange.mdx      # 洛杉矶 3982 S Orange Dr
│       ├── san-jose-5962-royal-ann.mdx    # 圣何塞 5962 Royal Ann Dr
│       └── mill-valley-100-marlin.mdx     # 米尔谷 100 Marlin Ave
│
├── package.json                 # 依赖（无需 API 密钥）
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | Next.js（App Router + Turbopack） | 16.1.6 |
| UI | React | 19.2.3 |
| 样式 | Tailwind CSS（v4, CSS 优先配置） | 4.x |
| MDX | @mdx-js/mdx（运行时 evaluate） | 3.1.1 |
| 图标 | lucide-react | 0.564.0 |
| 语言 | TypeScript | 5.x |
| 截图 | Playwright（仅 devDependency） | 1.58.2 |

---

## 已知局限与未来规划

### 当前局限

- **无服务端 MDX 编译**：MDX 在浏览器中通过 `evaluate()` 编译。首次加载增加约 200ms，但支持无构建步骤的动态报告加载。
- **仅单报告视图**：无法并排比较不同房产。
- **静态报告数据**：报告是磁盘上的 `.mdx` 文件。无实时数据获取或更新。
- **无打印/PDF 导出**：查看器仅限网页。PDF 生成由后端管线处理（Playwright + pypdf），非本查看器功能。
- **仅英文**：报告为英文。后端支持通过 GPT 翻译，但查看器没有语言切换器。

### 潜在增强

- [ ] 动画化章节过渡（交叉淡入而非显示/隐藏）
- [ ] 长章节内部的子目录
- [ ] 成本对比图表（选定方案 vs. 总预算）
- [ ] 交互式财务计算器（调整租金、空置率、增值）
- [ ] 移动端底部抽屉导航（而非完全隐藏侧边栏）
- [ ] 深色模式主题变体
- [ ] 通过 URL 分享报告，支持章节深链接
