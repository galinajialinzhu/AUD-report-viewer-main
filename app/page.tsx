import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-report-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-report-text mb-2">
          ADUPilot Report Viewer
        </h1>
        <p className="text-report-text-secondary mb-6">
          MDX component library experiment
        </p>
        <Link
          href="/report"
          className="inline-block bg-report-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          View Reports
        </Link>
      </div>
    </div>
  );
}
