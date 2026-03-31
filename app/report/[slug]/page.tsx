import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { notFound } from "next/navigation";
import { MDXRenderer } from "@/components/mdx-renderer";
import { ReportLayout } from "@/components/report-layout";

const REPORTS_DIR = join(process.cwd(), "data/reports");

export async function generateStaticParams() {
  try {
    const files = await readdir(REPORTS_DIR);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
  } catch {
    return [];
  }
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mdxPath = join(REPORTS_DIR, `${slug}.mdx`);

  let mdxSource: string;
  try {
    mdxSource = await readFile(mdxPath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <div className="bg-report-bg min-h-screen">
      <ReportLayout>
        <MDXRenderer source={mdxSource} />
      </ReportLayout>
    </div>
  );
}
