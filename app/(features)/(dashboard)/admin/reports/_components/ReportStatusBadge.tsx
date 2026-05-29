import type { ReportStatus } from "../../../../../../data/report-center-data";

const statusStyles: Record<ReportStatus, string> = {
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  processing: "bg-amber-50 text-amber-700 ring-amber-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
};

export default function ReportStatusBadge({
  status,
}: {
  status: ReportStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
