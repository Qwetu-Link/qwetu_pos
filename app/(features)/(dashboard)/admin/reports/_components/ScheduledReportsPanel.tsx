import { CalendarClock, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import type { ScheduledReport } from "@/types/reports";

export default function ScheduledReportsPanel({
  reports,
}: {
  reports: ScheduledReport[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-blue-600" />
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
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{report.title}</p>
                <p className="mt-1 text-xs text-slate-500">{report.owner}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                {report.frequency}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
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
