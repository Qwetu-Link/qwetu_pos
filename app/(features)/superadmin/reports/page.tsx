import Link from "next/link";
import {
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
import { getSuperAdminReportCenterData } from "@/db/queries/superadmin-reports";

const metricIcons = [CircleDollarSign, TrendingUp, Building2, ShieldAlert];

const exportFormats = [
  { href: "/superadmin/reports/export/csv", label: "CSV" },
  { href: "/superadmin/reports/export/xls", label: "XLS" },
  { href: "/superadmin/reports/export/pdf", label: "PDF" },
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ReportsPage() {
  const data = await getSuperAdminReportCenterData();

  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={BarChart3}
        title="Platform reports"
        description="Track revenue, tenant growth, subscription health, and operational risks from one superadmin reporting desk."
        actions={[
          { label: "Period", value: data.periodLabel },
          { label: "Generated", value: formatDate(data.generatedAt) },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <SuperAdminMetricCard
            key={metric.title}
            {...metric}
            icon={metricIcons[index] ?? FileBarChart}
          />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SuperAdminSurface className="overflow-hidden">
          <SuperAdminSectionTitle
            icon={FileBarChart}
            title="Report center"
            description="Open or export platform-level reporting packs."
            action={
              <div className="flex flex-wrap gap-2">
                {exportFormats.map((format) => (
                  <Link
                    key={format.label}
                    href={format.href}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
                  >
                    <Download className="h-4 w-4" />
                    {format.label}
                  </Link>
                ))}
              </div>
            }
          />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {data.reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-950">{report.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{report.detail}</p>
                  </div>
                  <SuperAdminStatusPill tone={report.status === "Review" ? "amber" : "emerald"}>
                    {report.status}
                  </SuperAdminStatusPill>
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Signal</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{report.value}</p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Live data
                  </p>
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
            {data.revenueTrend.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end rounded-t-lg bg-slate-100">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-lime-300"
                    style={{ height: `${point.height}%` }}
                    title={formatKes(point.amount)}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">{point.month}</span>
              </div>
            ))}
          </div>
        </SuperAdminSurface>
      </div>

      <SuperAdminSurface className="overflow-hidden">
        <SuperAdminSectionTitle
          icon={Building2}
          title="Tenant report rows"
          description="The same normalized tenant data used in the CSV, XLS, and PDF exports."
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Tenant</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Owners</th>
                <th className="px-5 py-3">Revenue</th>
                <th className="px-5 py-3">Outstanding</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Transactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.tenants.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-sm font-medium text-slate-500" colSpan={7}>
                    No tenant records are available yet.
                  </td>
                </tr>
              ) : (
                data.tenants.map((tenant) => (
                  <tr key={tenant.businessId} className="hover:bg-emerald-50/50">
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-950">{tenant.businessName}</p>
                      <p className="mt-1 text-xs text-slate-500">{tenant.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <SuperAdminStatusPill tone={tenant.status === "Active" ? "emerald" : "amber"}>
                        {tenant.status}
                      </SuperAdminStatusPill>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{tenant.owners}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatKes(tenant.revenue)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatKes(tenant.outstanding)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{tenant.orders}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{tenant.transactions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SuperAdminSurface>
    </SuperAdminPageShell>
  );
}
