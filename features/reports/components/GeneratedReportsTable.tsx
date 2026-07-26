import { Download } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import type { GeneratedReport } from "@/types/reports";
import ReportStatusBadge from "./ReportStatusBadge";

export default function GeneratedReportsTable({
  reports,
  onDownload,
}: {
  reports: GeneratedReport[];
  onDownload: (report: GeneratedReport) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Reports
          </h2>
          <p className="text-sm text-slate-500">
            Latest generated files and export status
          </p>
        </div>
      </div>
      {reports.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState
            compact
            icon={Download}
            title="No generated reports"
            description="Generated exports will appear here when report jobs complete."
          />
        </div>
      ) : (
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Report</th>
              <th className="px-5 py-3">Period</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {report.title}
                  </p>
                  <p className="text-xs text-slate-500">{report.id}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{report.period}</td>
                <td className="px-5 py-4 text-slate-600">
                  {report.createdAt}
                </td>
                <td className="px-5 py-4 text-slate-600">{report.size}</td>
                <td className="px-5 py-4">
                  <ReportStatusBadge status={report.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDownload(report)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={report.status !== "ready"}
                    aria-label={`Download ${report.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </section>
  );
}
