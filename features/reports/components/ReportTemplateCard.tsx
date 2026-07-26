import { Download, FileText, Play } from "lucide-react";
import type { ReportTemplate } from "@/types/reports";

export default function ReportTemplateCard({
  report,
  onDownload,
  onRun,
}: {
  report: ReportTemplate;
  onDownload: (report: ReportTemplate) => void;
  onRun: (report: ReportTemplate) => void;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <FileText className="h-5 w-5" />
        </span>
        <span className="max-w-[70%] truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {report.category}
        </span>
      </div>
      <div className="mt-4 min-w-0">
        <h2 className="text-base font-semibold text-slate-900">
          {report.title}
        </h2>
        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
          {report.description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {report.formats.map((format) => (
          <span
            key={format}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600"
          >
            {format}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-xs text-slate-500">{report.lastGenerated}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onDownload(report)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label={`Download ${report.title}`}
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRun(report)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700"
            aria-label={`Run ${report.title}`}
          >
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
