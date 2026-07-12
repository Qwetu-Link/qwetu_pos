import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminMetricCard,
  SuperAdminPageShell,
  SuperAdminPanel,
  SuperAdminStatusPill,
} from "./SuperAdminUI";

const cards = [
  { title: "Active businesses", value: "24", detail: "Live tenant workspaces", icon: Building2 },
  { title: "Active subscriptions", value: "18", detail: "Renewing plans", icon: Layers3 },
  { title: "Managed users", value: "312", detail: "Across all stores", icon: Users },
  { title: "Platform health", value: "98%", detail: "No critical alerts", icon: ShieldCheck },
];

const activity = [
  ["New business registration", "3 new workspaces created today", "Stable"],
  ["Subscription renewals", "5 renewals due this week", "Action"],
  ["Support requests", "8 pending escalations", "Review"],
];

const actions = [
  {
    label: "Register a new business",
    detail: "Create tenant workspace and owner account",
    href: "/superadmin/business",
  },
  {
    label: "Review subscription records",
    detail: "Inspect tenant status, owners, and activation",
    href: "/superadmin/subscriptions",
  },
  {
    label: "Open platform reports",
    detail: "Review revenue, tenant growth, and risk signals",
    href: "/superadmin/reports",
  },
];

export default function SuperAdminDashboard() {
  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={ShieldCheck}
        title="Platform command center"
        description="Monitor every business workspace, subscription, and operational signal from one place."
        actions={[
          { label: "System status", value: "Healthy" },
          { label: "Access level", value: "Global" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <SuperAdminMetricCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SuperAdminPanel
          title="Platform activity"
          description="Recent tenant and billing movement across the platform."
          icon={BarChart3}
        >
          <div className="space-y-3">
            {activity.map(([title, detail, status]) => (
              <div key={title} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold text-slate-950">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{detail}</p>
                </div>
                <SuperAdminStatusPill tone={status === "Stable" ? "emerald" : "amber"}>
                  {status}
                </SuperAdminStatusPill>
              </div>
            ))}
          </div>
        </SuperAdminPanel>

        <SuperAdminPanel
          title="Admin actions"
          description="Common superadmin workflows."
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-900">{action.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{action.detail}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-emerald-700" />
              </Link>
            ))}
          </div>
        </SuperAdminPanel>
      </section>
    </SuperAdminPageShell>
  );
}
