import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CircleDollarSign,
  Download,
  FileBarChart,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminMetricCard,
  SuperAdminPageShell,
  SuperAdminSectionTitle,
  SuperAdminStatusPill,
  SuperAdminSurface,
} from "@/features/superadmin/components/SuperAdminUI";

const metrics = [
  { title: "Platform revenue", value: "KES 4.8M", detail: "Across active tenant plans", icon: CircleDollarSign },
  { title: "Tenant growth", value: "+18%", detail: "Month over month", icon: TrendingUp },
  { title: "Active businesses", value: "24", detail: "Live workspaces", icon: Building2 },
  { title: "Risk alerts", value: "3", detail: "Need admin review", icon: ShieldAlert },
];

const reports = [
  ["Revenue summary", "Subscription income, collection status, and upcoming renewals.", "Ready", "KES 4.8M"],
  ["Tenant growth", "New businesses, activation timing, and workspace expansion.", "Ready", "+18%"],
  ["Risk review", "Inactive tenants, failed renewals, and owner account gaps.", "Review", "3 alerts"],
  ["Usage health", "Module adoption and activity across registered workspaces.", "Ready", "91%"],
];

export default function ReportsPage() {
  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={BarChart3}
        title="Platform reports"
        description="Track revenue, tenant growth, subscription health, and operational risks from one superadmin reporting desk."
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SuperAdminSurface className="overflow-hidden">
          <SuperAdminSectionTitle
            icon={FileBarChart}
            title="Report center"
            description="Open or export platform-level reporting packs."
            action={
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700">
                <Download className="h-4 w-4" />
                Export pack
              </button>
            }
          />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {reports.map(([title, detail, status, value]) => (
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
                <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Signal</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
                  </div>
                  <Link
                    href="/superadmin/reports"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
                  >
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminSurface>

        <SuperAdminSurface className="overflow-hidden">
          <SuperAdminSectionTitle
            icon={TrendingUp}
            title="Revenue trend"
            description="Reporting period movement."
          />
          <div className="flex h-72 items-end gap-3 p-5">
            {[48, 55, 51, 64, 70, 76, 82].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end rounded-t-lg bg-slate-100">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-lime-300"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">{index + 1}</span>
              </div>
            ))}
          </div>
        </SuperAdminSurface>
      </div>
    </SuperAdminPageShell>
  );
}
