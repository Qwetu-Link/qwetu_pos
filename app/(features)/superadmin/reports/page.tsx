import Link from "next/link";
import { ArrowRight, BarChart3, Building2, CircleDollarSign, Download, ShieldAlert, TrendingUp } from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminMetricCard,
  SuperAdminPageShell,
  SuperAdminPanel,
  SuperAdminStatusPill,
} from "../_components/SuperAdminUI";

const metrics = [
  { title: "Platform revenue", value: "KES 4.8M", detail: "Across active tenant plans", icon: CircleDollarSign },
  { title: "Tenant growth", value: "+18%", detail: "Month over month", icon: TrendingUp },
  { title: "Active businesses", value: "24", detail: "Live workspaces", icon: Building2 },
  { title: "Risk alerts", value: "3", detail: "Need admin review", icon: ShieldAlert },
];

const reports = [
  ["Revenue summary", "Subscription income, collection status, and upcoming renewals.", "Ready"],
  ["Tenant growth", "New businesses, activation timing, and workspace expansion.", "Ready"],
  ["Risk review", "Inactive tenants, failed renewals, and owner account gaps.", "Review"],
  ["Usage health", "Module adoption and activity across registered workspaces.", "Ready"],
];

export default function ReportsPage() {
  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={BarChart3}
        title="Platform reports"
        description="Track revenue, tenant growth, subscription health, and operational risks from one superadmin view."
        actions={[
          { label: "Period", value: "This month" },
          { label: "Exports", value: "4 reports" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SuperAdminMetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <SuperAdminPanel
        title="Report center"
        description="Open or export platform-level reporting packs."
        icon={Download}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {reports.map(([title, detail, status]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-950">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
                </div>
                <SuperAdminStatusPill tone={status === "Review" ? "amber" : "emerald"}>
                  {status}
                </SuperAdminStatusPill>
              </div>
              <Link
                href="/superadmin/reports"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
              >
                View report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </SuperAdminPanel>
    </SuperAdminPageShell>
  );
}
