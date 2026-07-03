import EmptyState from "@/components/common/EmptyState";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import type { DashboardBar } from "@/data/dashboard-data";

export default function DashboardProgressPanel({ bars }: { bars: DashboardBar[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Focus Metrics</h2>
      {bars.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            compact
            icon={ChartNoAxesColumnIncreasing}
            title="No focus metrics"
            description="Progress metrics will appear here after dashboard data is available."
          />
        </div>
      ) : (
      <div className="mt-4 space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {bar.label}
                </p>
                <p className="text-xs text-slate-500">{bar.caption}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-700">
                {bar.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
