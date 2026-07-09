"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Plus, Save, Trash2 } from "lucide-react";
import type { BudgetFieldProps, BudgetLine, BudgetScope } from "@/types/finance";
import { PageLayout } from "../../../../_components/page-layout";

const initialLines: BudgetLine[] = [
  { id: 1, scope: "Branch", name: "Nairobi CBD", payrollBudget: 1450000, expenseBudget: 2200000, owner: "Mary Kariuki" },
  { id: 2, scope: "Department", name: "Sales", payrollBudget: 1240000, expenseBudget: 1320000, owner: "John Mwangi" },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function Field({
  label,
  value,
  type = "text",
  onChange,
}: BudgetFieldProps) {
  return (
    <label className="block text-sm font-medium text-[#D3E3F0]">
      {label}
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-lg border border-[#42688C]/50 bg-[#0C0F1D] px-3 text-sm text-white outline-none transition focus:border-[#42688C] focus:ring-2 focus:ring-[#42688C]/30"
      />
    </label>
  );
}

export default function AddBudgetPage() {
  const [budgetName, setBudgetName] = useState("FY 2026 Operating Budget");
  const [period, setPeriod] = useState("2026");
  const [lines, setLines] = useState<BudgetLine[]>(initialLines);

  const totals = useMemo(() => {
    const payroll = lines.reduce((sum, line) => sum + line.payrollBudget, 0);
    const expenses = lines.reduce((sum, line) => sum + line.expenseBudget, 0);

    return {
      payroll,
      expenses,
      total: payroll + expenses,
      branches: lines.filter((line) => line.scope === "Branch").length,
      departments: lines.filter((line) => line.scope === "Department").length,
    };
  }, [lines]);

  function updateLine(id: number, patch: Partial<BudgetLine>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function addLine() {
    setLines((current) => [
      ...current,
      {
        id: Math.max(...current.map((line) => line.id), 0) + 1,
        scope: "Department",
        name: "",
        payrollBudget: 0,
        expenseBudget: 0,
        owner: "",
      },
    ]);
  }

  function removeLine(id: number) {
    setLines((current) => current.filter((line) => line.id !== id));
  }

  return (
    <PageLayout
      title="Add Budget"
      subtitle="Create payroll and expense allocations per branch or department"
      actions={
        <>
          <Link
            href="/finance-erp/budgeting"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-[#42688C]/50 bg-[#0C0F1D] px-2.5 text-sm font-medium text-[#D3E3F0] transition hover:bg-[#13203A]"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
            <Save className="h-4 w-4" /> Save Budget
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Draft Total", value: formatCurrency(totals.total), helper: "Payroll plus operating expenses" },
            { label: "Salary Payroll", value: formatCurrency(totals.payroll), helper: "People cost allocation" },
            { label: "Expenses", value: formatCurrency(totals.expenses), helper: "Operating spend allocation" },
            { label: "Coverage", value: `${totals.branches} / ${totals.departments}`, helper: "Branches / departments" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <p className="text-sm font-medium text-[#9CB4CA]">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-[#9CB4CA]">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="border-b border-[#42688C]/20 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Budget Details</h2>
            <p className="text-sm text-[#9CB4CA]">Name the budget and define the fiscal period.</p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <Field label="Budget Name" value={budgetName} onChange={setBudgetName} />
            <Field label="Fiscal Period" value={period} onChange={setPeriod} />
          </div>
        </section>

        <section className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#42688C]/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Branch & Department Allocations</h2>
              <p className="text-sm text-[#9CB4CA]">Enter salary payroll and expense budgets for each unit.</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={addLine}>
              <Plus className="h-4 w-4" /> Add Line
            </Button>
          </div>

          <div className="divide-y divide-[#42688C]/20">
            {lines.map((line) => (
              <div key={line.id} className="grid gap-4 p-5 lg:grid-cols-[150px_1fr_1fr_1fr_1fr_auto] lg:items-end">
                <label className="block text-sm font-medium text-[#D3E3F0]">
                  Scope
                  <select
                    value={line.scope}
                    onChange={(event) => updateLine(line.id, { scope: event.target.value as BudgetScope })}
                    className="mt-2 h-10 w-full rounded-lg border border-[#42688C]/50 bg-[#0C0F1D] px-3 text-sm text-white outline-none transition focus:border-[#42688C] focus:ring-2 focus:ring-[#42688C]/30"
                  >
                    <option value="Branch">Branch</option>
                    <option value="Department">Department</option>
                  </select>
                </label>
                <Field label="Branch / Department" value={line.name} onChange={(value) => updateLine(line.id, { name: value })} />
                <Field label="Salary Payroll" type="number" value={line.payrollBudget} onChange={(value) => updateLine(line.id, { payrollBudget: Number(value) })} />
                <Field label="Expense Budget" type="number" value={line.expenseBudget} onChange={(value) => updateLine(line.id, { expenseBudget: Number(value) })} />
                <Field label="Budget Owner" value={line.owner} onChange={(value) => updateLine(line.id, { owner: value })} />
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="flex h-10 w-full items-center justify-center rounded-lg border border-[#42688C]/30 text-[#9CB4CA] transition hover:bg-red-400/15 hover:text-red-200 lg:w-10"
                  aria-label={`Remove ${line.name || "budget line"}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#42688C]/20 bg-[#13203A] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[#B8CBE0]">
              <Building2 className="h-4 w-4 text-[#E2F4DF]" />
              Draft total: <span className="font-semibold text-white">{formatCurrency(totals.total)}</span>
            </div>
            <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
              <Save className="h-4 w-4" /> Save Budget
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
