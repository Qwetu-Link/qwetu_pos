import { Download } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { SimpleDataTable } from "@/components/datatables";
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
        <SimpleDataTable
          minWidth="min-w-[760px]"
          headers={[
            "Report",
            "Period",
            "Created",
            "Size",
            "Status",
            { label: "Action", className: "text-right" },
          ]}
          rows={reports.map((report) => ({
            id: report.id,
            cells: [
              <div key="report">
                  <p className="font-semibold text-slate-900">
                    {report.title}
                  </p>
                  <p className="text-xs text-slate-500">{report.id}</p>
              </div>,
              report.period,
              report.createdAt,
              report.size,
              <ReportStatusBadge key="status" status={report.status} />,
              <div key="action" className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onDownload(report)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={report.status !== "ready"}
                    aria-label={`Download ${report.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
              </div>,
            ],
          }))}
        />
      )}
    </section>
  );
}
