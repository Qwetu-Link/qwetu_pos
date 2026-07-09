"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "../../../_components/page-layout";
import {
  Building2,
  Download,
  Edit3,
  Eye,
  Globe,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinanceEntity, FinanceEntityStatus } from "@/types/finance";

const entities: FinanceEntity[] = [
  { id: "ENT-001", name: "Qwetu Aberdare Heights (USIU)", type: "Premium Hub", country: "Kenya", currency: "KES", employees: 142, revenue: 62300000, status: "paid" },
  { id: "ENT-002", name: "Qwetu Hurlingham Hub", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 86, revenue: 18400000, status: "paid" },
  { id: "ENT-003", name: "Qwetu Jogoo Road Residence", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 94, revenue: 9200000, status: "paid" },
  { id: "ENT-004", name: "Qwetu Parklands Properties", type: "Premium Hub", country: "Kenya", currency: "KES", employees: 72, revenue: 5800000, status: "scheduled" },
  { id: "ENT-005", name: "Qwetu Ruaraka Residences", type: "JV Portfolio", country: "Kenya", currency: "KES", employees: 24, revenue: 2100000, status: "scheduled" },
  { id: "ENT-006", name: "Qwetu Catholic University Link", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 38, revenue: 3400000, status: "failed" },
];

function StatusBadge({ status }: { status: FinanceEntityStatus }) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    scheduled: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    failed: "bg-red-50 text-red-700 ring-1 ring-red-100",
  };

  const labels = {
    paid: "active",
    scheduled: "pending",
    failed: "review",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

export default function EntitiesPage() {
  const [filterType, setFilterType] = useState("all");

  const filteredEntities = entities.filter((entity) => {
    if (filterType === "all") return true;
    return entity.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const totalStaff = entities.reduce((sum, entity) => sum + entity.employees, 0);
  const totalRevenue = entities.reduce((sum, entity) => sum + entity.revenue, 0);

  return (
    <PageLayout
      title="Property Entities & Branches"
      subtitle="Corporate portfolio configuration, inter-branch allocations, and consolidated rental revenue"
      actions={
        <>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Group Data
          </Button>
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> Add New Branch
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Branches", value: String(entities.length), helper: "2 premium, 3 standard, 1 JV", icon: Building2 },
            { label: "Total Staffing", value: totalStaff.toLocaleString(), helper: "+12.1% operations scale", icon: Users },
            { label: "Consolidated Revenue", value: formatCurrency(totalRevenue), helper: "+14.2% FY2026 run-rate", icon: TrendingUp },
            { label: "Base Currency", value: "KES", helper: "Used across all branches", icon: Globe },
          ].map(({ label, value, helper, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{helper}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 border-b border-slate-200 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All portfolios" },
              { id: "premium", label: "Premium hubs" },
              { id: "standard", label: "Standard residences" },
              { id: "jv", label: "Joint ventures" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilterType(item.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  filterType === item.id
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-500">Showing {filteredEntities.length} of {entities.length} records</span>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {filteredEntities.map((entity) => (
            <article
              key={entity.id}
              className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-slate-900">{entity.name}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{entity.id}</span>
                      <span>{entity.type}</span>
                      <span>{entity.country}</span>
                    </div>
                  </div>
                  <StatusBadge status={entity.status} />
                </div>

                <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Reporting Currency</p>
                    <p className="mt-1 font-bold text-slate-900">{entity.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Operations Staff</p>
                    <p className="mt-1 font-bold text-slate-900">{entity.employees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Annualized Revenue</p>
                    <p className="mt-1 font-bold text-slate-900">{formatCurrency(entity.revenue)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700">
                  <Eye className="h-4 w-4" /> View Ledger Balance
                </button>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700">
                  <Edit3 className="h-4 w-4" /> Property Configurations
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Annualized Branch Portfolio Contribution</h2>
            <p className="text-sm text-slate-500">Revenue contribution shown in KES millions.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={entities.map((entity) => ({
                  shortName: entity.name.replace("Qwetu ", "").split(" ")[0],
                  revenueKES: entity.revenue / 1000000,
                }))}
                margin={{ left: -15, right: 5, bottom: 5 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `KES ${value}M`} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    background: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenueKES" name="Revenue Base (KES)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
