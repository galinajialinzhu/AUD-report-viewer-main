export interface SectionInfo {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
}

/** Fixed 6 sidebar categories; content sections are grouped under these */
export const SIDEBAR_CATEGORIES: SectionInfo[] = [
  { id: "overview", title: "Overview", shortTitle: "Overview", icon: "layout-dashboard" },
  { id: "zoning-eligibility", title: "Zoning & Eligibility", shortTitle: "Zoning & Eligibility", icon: "landmark" },
  { id: "utility", title: "Utility", shortTitle: "Utility", icon: "zap" },
  { id: "risks-constraints", title: "Risks & Constraints", shortTitle: "Risks & Constraints", icon: "triangle-alert" },
  { id: "design-costs", title: "Design & Costs", shortTitle: "Design & Costs", icon: "circle-dollar-sign" },
  { id: "action-checklist", title: "The Action Checklist", shortTitle: "Action Checklist", icon: "clipboard-list" },
];

/**
 * Map a report section id (from slugify(title)) to one of the 6 sidebar category ids.
 * Used to group DOM sections under the fixed sidebar items.
 */
export function sectionIdToCategory(sectionId: string): string {
  const id = sectionId.toLowerCase();
  if (id.includes("executive-summary") || id.includes("applicable-adu") || id.includes("regulations")) return "zoning-eligibility";
  if (id.includes("major-constraints") || id.includes("hazards") || id.includes("risk-register") || id.includes("constraints")) return "risks-constraints";
  if (id.includes("utility") || id.includes("site-conditions")) return "utility";
  if (id.includes("recommended-adu") || id.includes("adu-concepts") || id.includes("cost-breakdown") || id.includes("financial-analysis") || id.includes("rental-market")) return "design-costs";
  if (id.includes("process") || id.includes("permitting") || id.includes("timeline") || id.includes("additional-owner") || id.includes("guidance") || id.includes("contacts") || id.includes("references") || id.includes("agency-information") || id.includes("sources")) return "action-checklist";
  return "overview";
}

/** Convert a section title into a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Extract a short title from a full section heading.
 * "1. Applicable ADU Regulations & Development Standards (LA City)"
 *  → "ADU Regulations"
 *
 * Falls back to the first 3 meaningful words if no pattern matches.
 */
export function parseShortTitle(title: string): string {
  // Strip leading number + period (e.g. "1. ", "2. ")
  const stripped = title.replace(/^\d+\.\s*/, "");

  // Strip trailing parenthetical (e.g. "(LA City)")
  const noParens = stripped.replace(/\s*\([^)]*\)\s*$/, "").trim();

  // If there's a colon or dash separator, take the left part
  const parts = noParens.split(/\s*[:\u2013\u2014–—]\s*/);
  let candidate = parts[0].trim();

  // If still too long (> 30 chars), take first 3 words
  if (candidate.length > 30) {
    candidate = candidate.split(/\s+/).slice(0, 3).join(" ");
  }

  return candidate || title;
}
