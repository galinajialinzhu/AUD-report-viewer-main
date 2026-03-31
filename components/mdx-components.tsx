import { FeasibilityBadge } from "./report/feasibility-badge";
import { PropertySnapshot } from "./report/property-snapshot";
import { StatRow, StatCard } from "./report/stat-row";
import { OverlayGrid, OverlayBadge } from "./report/overlay-grid";
import { SectionHeading } from "./report/section-heading";
import { RiskList } from "./report/risk-list";
import { OpportunityList } from "./report/opportunity-list";
import { ChecklistProgress } from "./report/checklist-progress";
import { Callout } from "./report/callout";
import { CostBreakdown } from "./report/cost-breakdown";
import { ComparisonTable } from "./report/comparison-table";
import { CollapsibleSection } from "./report/collapsible-section";
import { ContactCard } from "./report/contact-card";
import { SchemeComparison } from "./report/scheme-comparison";
import { CostSavings } from "./report/cost-savings";
import { TimelineStep } from "./report/timeline-step";
import { SourceList, Source } from "./report/source-list";
import { CitationRef } from "./report/citation-ref";
import { KeyAlerts } from "./report/key-alerts";
import { ModuleCards } from "./report/module-cards";
import { ZoningStatusCard } from "./report/zoning-status-card";
import { UtilityCards, UtilityCardsWithSolar } from "./report/utility-cards";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Report components
    FeasibilityBadge,
    PropertySnapshot,
    StatRow,
    StatCard,
    OverlayGrid,
    OverlayBadge,
    SectionHeading,
    RiskList,
    OpportunityList,
    ChecklistProgress,
    Callout,
    CostBreakdown,
    ComparisonTable,
    CollapsibleSection,
    ContactCard,
    SchemeComparison,
    CostSavings,
    TimelineStep,
    SourceList,
    Source,
    CitationRef,
    KeyAlerts,
    ModuleCards,
    ZoningStatusCard,
    UtilityCards,
    UtilityCardsWithSolar,
    // Typography: H1/H2/H3 Montserrat Regular, paragraph Light 14, link 16 #2F68DE
    h1: (props) => <h1 className="font-sans text-h1 font-normal tracking-tight leading-tight text-report-text mb-5" {...props} />,
    h2: (props) => <h2 className="font-sans text-h2 font-normal text-report-text mt-10 mb-4" {...props} />,
    h3: (props) => <h3 className="font-sans text-[14px] font-normal text-report-text mt-6 mb-2.5" {...props} />,
    p: (props) => <p className="font-sans text-[14px] font-light text-report-text-secondary leading-[1.75] mb-4" {...props} />,
    a: (props) => <a className="font-sans text-link font-normal text-report-link hover:opacity-80 underline underline-offset-2 transition-opacity" {...props} />,
    strong: (props) => <strong className="font-semibold text-report-text" {...props} />,
    ul: (props) => <ul className="font-sans text-[14px] font-light text-report-text-secondary leading-[1.75] space-y-2 ml-5 list-disc mb-4 marker:text-report-text-tertiary" {...props} />,
    ol: (props) => <ol className="font-sans text-[14px] font-light text-report-text-secondary leading-[1.75] space-y-2 ml-5 list-decimal mb-4 marker:text-report-text-tertiary" {...props} />,
    li: (props) => <li className="leading-[1.75] pl-1" {...props} />,
    hr: () => <hr className="border-report-border my-10" />,
    blockquote: (props) => <blockquote className="border-l-2 border-report-link/40 pl-5 py-2 my-6 font-sans text-[14px] font-light text-report-text-secondary italic" {...props} />,
    ...components,
  };
}
