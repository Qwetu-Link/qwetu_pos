import { CalendarClock, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import type { ScheduledReport } from "@/types/reports";

export default function ScheduledReportsPanel({
  reports,
}: {
  reports: ScheduledReport[];
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex min-w-0 items-center gap-2">
        <CalendarClock className="h-5 w-5 shrink-0 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Scheduled Reports
        </h2>
      </div>
      {reports.length === 0 ? (
        <EmptyState
          compact
          icon={CalendarClock}
          title="No scheduled reports"
          description="Recurring report schedules will appear here after they are configured."
        />
      ) : (
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.title}
            className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{report.title}</p>
                <p className="mt-1 text-xs text-slate-500">{report.owner}</p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                {report.frequency}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span>{report.nextRun}</span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {report.recipients}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
