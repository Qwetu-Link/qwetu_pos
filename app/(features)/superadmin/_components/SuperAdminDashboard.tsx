"use client";

import { signOut } from "next-auth/react";
import { Building2, Layers3, ShieldCheck, Users, BarChart3, LogOut } from "lucide-react";

const cards = [
  { title: "Active businesses", value: "24", detail: "Live tenant workspaces", icon: Building2 },
  { title: "Active subscriptions", value: "18", detail: "Renewing plans", icon: Layers3 },
  { title: "Managed users", value: "312", detail: "Across all stores", icon: Users },
  { title: "Platform health", value: "98%", detail: "No critical alerts", icon: ShieldCheck },
];

export default function SuperAdminDashboard() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Super Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Platform command center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Monitor every business workspace, subscription, and operational signal from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              All systems healthy
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{card.title}</p>
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            Platform activity
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["New business registration", "3 new workspaces created today"],
              ["Subscription renewals", "5 renewals due this week"],
              ["Support requests", "8 pending escalations"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Admin actions
          </div>
          <div className="mt-6 space-y-3">
            {[
              "Approve new business onboarding",
              "Review subscription plan changes",
              "Investigate platform alerts",
            ].map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span>{action}</span>
                <span className="text-emerald-600">↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
