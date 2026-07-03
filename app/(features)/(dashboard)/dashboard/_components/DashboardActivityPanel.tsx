import EmptyState from "@/components/common/EmptyState";
import { Activity } from "lucide-react";
import type { DashboardActivity, DashboardTone } from "@/data/dashboard-data";

const dotStyles: Record<DashboardTone, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  slate: "bg-slate-500",
};

export default function DashboardActivityPanel({
  activities,
}: {
  activities: DashboardActivity[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Live Activity</h2>
      {activities.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            compact
            icon={Activity}
            title="No activity yet"
            description="Recent order, stock, and collection events will appear here."
          />
        </div>
      ) : (
      <div className="mt-4 space-y-4">
        {activities.map((activity) => (
          <div key={`${activity.title}-${activity.time}`} className="flex gap-3">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotStyles[activity.tone]}`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{activity.title}</p>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
