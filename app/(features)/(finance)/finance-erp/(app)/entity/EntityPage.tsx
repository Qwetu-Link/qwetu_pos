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
    paid: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    scheduled: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
    failed: "bg-red-400/15 text-red-200 ring-1 ring-red-300/25",
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
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
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
            <div key={label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#9CB4CA]">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs text-[#9CB4CA]">{helper}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 border-b border-[#42688C]/30 pb-3 lg:flex-row lg:items-center lg:justify-between">
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
                    ? "bg-[#42688C] text-white"
                    : "text-[#B8CBE0] hover:bg-[#1A2846] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-[#9CB4CA]">Showing {filteredEntities.length} of {entities.length} records</span>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {filteredEntities.map((entity) => (
            <article
              key={entity.id}
              className="flex min-w-0 flex-col justify-between rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm transition hover:border-[#42688C]/50 hover:shadow-md"
            >
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white">{entity.name}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#9CB4CA]">
                      <span className="rounded-full bg-[#1A2846] px-2.5 py-1 text-xs font-semibold text-[#B8CBE0] ring-1 ring-[#42688C]/30">{entity.id}</span>
                      <span>{entity.type}</span>
                      <span>{entity.country}</span>
                    </div>
                  </div>
                  <StatusBadge status={entity.status} />
                </div>

                <div className="grid gap-3 rounded-lg border border-[#42688C]/30 bg-[#13203A] p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-[#9CB4CA]">Reporting Currency</p>
                    <p className="mt-1 font-bold text-white">{entity.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#9CB4CA]">Operations Staff</p>
                    <p className="mt-1 font-bold text-white">{entity.employees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#9CB4CA]">Annualized Revenue</p>
                    <p className="mt-1 font-bold text-white">{formatCurrency(entity.revenue)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-[#42688C]/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#9CB4CA] transition-colors hover:text-[#E2F4DF]">
                  <Eye className="h-4 w-4" /> View Ledger Balance
                </button>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#9CB4CA] transition-colors hover:text-[#E2F4DF]">
                  <Edit3 className="h-4 w-4" /> Property Configurations
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Annualized Branch Portfolio Contribution</h2>
            <p className="text-sm text-[#9CB4CA]">Revenue contribution shown in KES millions.</p>
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
                <CartesianGrid stroke="#42688C" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} tickFormatter={(value) => `KES ${value}M`} />
                <Tooltip
                  cursor={{ fill: "#1A2846" }}
                  contentStyle={{
                    background: "#0C0F1D",
                    borderRadius: "8px",
                    border: "1px solid #42688C",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenueKES" name="Revenue Base (KES)" fill="#42688C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
