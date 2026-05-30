import { LayoutDashboard } from "lucide-react";
import type { RoleDashboardData } from "@/data/dashboard-data";
import DashboardActions from "./DashboardActions";
import DashboardActivityPanel from "./DashboardActivityPanel";
import DashboardMetricCard from "./DashboardMetricCard";
import DashboardProgressPanel from "./DashboardProgressPanel";

export default function RoleDashboard({
  dashboard,
}: {
  dashboard: RoleDashboardData;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {dashboard.eyebrow}
          </p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-black">
            <LayoutDashboard className="h-8 w-8 text-emerald-600" />
            {dashboard.title}
          </h1>
          <p className="mt-1 text-slate-500">{dashboard.description}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <DashboardMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <DashboardActivityPanel activities={dashboard.activities} />
          <DashboardProgressPanel bars={dashboard.bars} />
        </div>
        <DashboardActions actions={dashboard.actions} />
      </div>
    </div>
  );
}
