import { readdir } from "fs/promises";
import { join } from "path";
import Link from "next/link";

interface ReportMeta {
  slug: string;
  label: string;
  city: string;
}

const REPORTS_DIR = join(process.cwd(), "data/reports");

const REPORT_META: Record<string, { label: string; city: string }> = {
  "la-city-3982-s-orange": { label: "3982 S Orange Dr, Los Angeles, CA 90008", city: "Los Angeles" },
  "san-jose-5962-royal-ann": { label: "5962 Royal Ann Dr, San Jose, CA 95129", city: "San Jose" },
  "mill-valley-100-marlin": { label: "100 Marlin Ave, Mill Valley, CA 94941", city: "Mill Valley" },
};

async function getReports(): Promise<ReportMeta[]> {
  const reports: ReportMeta[] = [];

  try {
    const files = await readdir(REPORTS_DIR);
    for (const f of files) {
      if (!f.endsWith(".mdx")) continue;
      const slug = f.replace(/\.mdx$/, "");
      const meta = REPORT_META[slug];
      reports.push({
        slug,
        label: meta?.label ?? slug,
        city: meta?.city ?? "California",
      });
    }
  } catch {
    // no data/reports directory yet
  }

  return reports;
}

export default async function ReportIndexPage() {
  const reports = await getReports();

  return (
    <div className="bg-report-bg min-h-screen py-12 px-4">
      <div className="mx-auto max-w-[640px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-icon-fill)]">
              <svg className="h-4 w-4 text-[var(--color-icon-stroke)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="font-sans text-[30px] font-normal text-report-text">
              ADU Feasibility Reports
            </h1>
          </div>
          <p className="font-sans text-[14px] font-light text-report-text-secondary">
            Select a report to view the full ADU feasibility analysis.
          </p>
          <div className="mt-3 flex h-[2px]">
            <div className="w-12 bg-report-accent" />
            <div className="flex-1 bg-report-border-light" />
          </div>
        </div>

        {/* Count badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-report-accent/10 px-3 py-1 text-[11px] font-bold text-report-accent">
            {reports.length} Reports Available
          </span>
        </div>

        {/* Report cards */}
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <Link
              key={r.slug}
              href={`/report/${r.slug}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-report-border-light bg-report-surface px-5 py-4 transition-all hover:border-report-accent/30 hover:shadow-sm"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-report-accent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="min-w-0 flex-1">
                <span className="mb-1 inline-block rounded bg-report-surface-alt px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-report-text-tertiary">
                  {r.city}
                </span>
                <p className="text-[14px] font-semibold text-report-text transition-colors group-hover:text-report-accent">
                  {r.label}
                </p>
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-report-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-report-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
