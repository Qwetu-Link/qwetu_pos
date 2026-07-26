import type { DashboardMetric, DashboardTone } from "@/data/dashboard-data";

const toneStyles: Record<DashboardTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-50 text-slate-700",
};

export default function DashboardMetricCard({
  metric,
}: {
  metric: DashboardMetric;
}) {
  const Icon = metric.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {metric.value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneStyles[metric.tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">
        {metric.detail}
      </p>
    </div>
  );
}
