"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLayout } from "../../../_components/page-layout";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BudgetAllocation, BudgetTrendPoint, FinanceChartTooltipProps } from "@/types/finance";

const monthlyBudgetData: BudgetTrendPoint[] = [
  { month: "Jan", revenue: 4820000, expenses: 3140000, payroll: 1280000, budget: 4330000 },
  { month: "Feb", revenue: 5210000, expenses: 3380000, payroll: 1310000, budget: 4370000 },
  { month: "Mar", revenue: 4990000, expenses: 3520000, payroll: 1325000, budget: 4410000 },
  { month: "Apr", revenue: 6340000, expenses: 3710000, payroll: 1360000, budget: 4450000 },
  { month: "May", revenue: 7120000, expenses: 4020000, payroll: 1390000, budget: 4490000 },
  { month: "Jun", revenue: 6880000, expenses: 3890000, payroll: 1410000, budget: 4530000 },
];

const forecastData: BudgetTrendPoint[] = [
  ...monthlyBudgetData,
  { month: "Jul", revenue: 9200000, expenses: 5100000, payroll: 1450000, budget: 4570000 },
  { month: "Aug", revenue: 9500000, expenses: 5200000, payroll: 1480000, budget: 4610000 },
  { month: "Sep", revenue: 9800000, expenses: 5300000, payroll: 1510000, budget: 4650000 },
  { month: "Oct", revenue: 10200000, expenses: 5500000, payroll: 1540000, budget: 4690000 },
  { month: "Nov", revenue: 10800000, expenses: 5700000, payroll: 1580000, budget: 4730000 },
  { month: "Dec", revenue: 11400000, expenses: 5900000, payroll: 1620000, budget: 4770000 },
];

const initialAllocations: BudgetAllocation[] = [
  { id: 1, scope: "Branch", name: "Nairobi CBD", payrollBudget: 1450000, expenseBudget: 2200000, owner: "Mary Kariuki" },
  { id: 2, scope: "Branch", name: "Westlands", payrollBudget: 980000, expenseBudget: 1640000, owner: "James Kiplagat" },
  { id: 3, scope: "Department", name: "Sales", payrollBudget: 1240000, expenseBudget: 1320000, owner: "John Mwangi" },
  { id: 4, scope: "Department", name: "Operations", payrollBudget: 1880000, expenseBudget: 2410000, owner: "Sarah Kipchoge" },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function formatCompact(value: number) {
  return `${(value / 1000000).toFixed(1)}M`;
}

function CustomChartTip({ active, payload, label }: FinanceChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#42688C]/30 bg-[#0C0F1D] p-3 text-xs shadow-md">
      <p className="mb-2 font-semibold text-white">{label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-2 text-[#9CB4CA]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
              {item.name}
            </span>
            <span className="font-semibold text-white">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BudgetingPage() {
  const allocations = initialAllocations;
  const payroll = allocations.reduce((sum, allocation) => sum + allocation.payrollBudget, 0);
  const expenses = allocations.reduce((sum, allocation) => sum + allocation.expenseBudget, 0);
  const totals = {
    payroll,
    expenses,
    budget: payroll + expenses,
    branches: allocations.filter((allocation) => allocation.scope === "Branch").length,
    departments: allocations.filter((allocation) => allocation.scope === "Department").length,
  };

  return (
    <PageLayout
      title="Budgeting & Forecasting"
      subtitle="Plan payroll and operating expenses by branch or department"
      actions={
        <>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Fiscal Period
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Link
            href="/finance-erp/budgeting/add"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#42688C] px-2.5 text-sm font-medium text-white transition hover:bg-[#52789B]"
          >
            <Plus className="h-4 w-4" /> Add Budget Line
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Proposed Budget", value: formatCurrency(totals.budget), helper: `${totals.branches} branches / ${totals.departments} departments` },
            { label: "Salary Payroll Budget", value: formatCurrency(totals.payroll), helper: "People cost allocation" },
            { label: "Operating Expenses", value: formatCurrency(totals.expenses), helper: "Non-payroll spend plan" },
            { label: "Forecast Variance", value: formatCurrency(2100000), helper: "Above approved baseline" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <p className="text-sm font-medium text-[#9CB4CA]">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-[#9CB4CA]">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">Budget Utilization by Unit</p>
            <div className="mt-5 space-y-5">
              {allocations.map((allocation) => {
                const planned = allocation.payrollBudget + allocation.expenseBudget;
                const consumed = allocation.expenseBudget * 0.72 + allocation.payrollBudget * 0.58;
                const pctSpent = planned > 0 ? Math.round((consumed / planned) * 100) : 0;

                return (
                  <div key={allocation.id}>
                    <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-white">{allocation.name}</p>
                        <p className="text-xs text-[#9CB4CA]">{allocation.scope} / {allocation.owner}</p>
                      </div>
                      <div className="text-sm font-semibold text-white">{formatCurrency(planned)}</div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#1A2846]">
                      <div className="h-full rounded-full bg-[#42688C]" style={{ width: `${Math.min(pctSpent, 100)}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-[#9CB4CA]">
                      <span>{pctSpent}% consumed</span>
                      <span>Payroll {formatCurrency(allocation.payrollBudget)} / Expenses {formatCurrency(allocation.expenseBudget)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Allocation Mix</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#42688C]/20 pb-3">
                  <span className="text-sm text-[#B8CBE0]">Payroll share</span>
                  <span className="font-semibold text-white">{totals.budget ? Math.round((totals.payroll / totals.budget) * 100) : 0}%</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#42688C]/20 pb-3">
                  <span className="text-sm text-[#B8CBE0]">Expense share</span>
                  <span className="font-semibold text-white">{totals.budget ? Math.round((totals.expenses / totals.budget) * 100) : 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#B8CBE0]">Highest allocation</span>
                  <span className="font-semibold text-white">
                    {allocations.reduce((top, item) => (item.payrollBudget + item.expenseBudget > top.payrollBudget + top.expenseBudget ? item : top), allocations[0])?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-300/25 bg-amber-400/15 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <h2 className="font-semibold text-white">Review Thresholds</h2>
                  <p className="mt-1 text-sm text-[#B8CBE0]">
                    Any branch or department above KES 4M should be reviewed by finance before approval.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">Monthly Burn vs Budget</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyBudgetData} margin={{ left: -20, right: 10, top: 5 }}>
                  <CartesianGrid stroke="#42688C" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} tickFormatter={(value) => formatCompact(Number(value))} />
                  <Tooltip content={<CustomChartTip />} />
                  <Line type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#E2F4DF" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="payroll" name="Salary Payroll" stroke="#42688C" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="budget" name="Approved Budget" stroke="#9CB4CA" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">12-Month Forecast</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#E2F4DF]">
                <TrendingUp className="h-4 w-4" />
                Predictive trend
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ left: -20, right: 10, top: 5 }}>
                  <defs>
                    <linearGradient id="budgetForecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E2F4DF" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#E2F4DF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#42688C" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} tickFormatter={(value) => formatCompact(Number(value))} />
                  <Tooltip content={<CustomChartTip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue Forecast" stroke="#E2F4DF" strokeWidth={2} fill="url(#budgetForecastFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-200">
              <ArrowUpRight className="h-4 w-4" />
              Expense growth
            </div>
            <p className="mt-2 text-2xl font-bold text-white">+8.2%</p>
            <p className="mt-1 text-xs text-[#9CB4CA]">Against previous fiscal cycle</p>
          </div>
          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#E2F4DF]">
              <ArrowDownRight className="h-4 w-4" />
              Reserve use
            </div>
            <p className="mt-2 text-2xl font-bold text-white">-14.8%</p>
            <p className="mt-1 text-xs text-[#9CB4CA]">Projected improvement after allocation controls</p>
          </div>
          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              Approval status
            </div>
            <p className="mt-2 text-2xl font-bold text-white">Draft</p>
            <p className="mt-1 text-xs text-[#9CB4CA]">Ready for finance manager review</p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
