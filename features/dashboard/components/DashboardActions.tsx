import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import { ArrowRight, ListChecks } from "lucide-react";
import type { DashboardAction } from "@/data/dashboard-data";

export default function DashboardActions({
  actions,
}: {
  actions: DashboardAction[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      {actions.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            compact
            icon={ListChecks}
            title="No quick actions"
            description="Role-specific shortcuts will appear here once configured."
          />
        </div>
      ) : (
      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
          >
            <span>
              <span className="block font-semibold text-slate-900">
                {action.label}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {action.detail}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}
