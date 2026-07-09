"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "../../../_components/page-layout";
import {
  Banknote,
  CalendarClock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Send,
  ShieldCheck,
  UploadCloud,
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
import type {
  PayRun,
  PayrollComplianceItem,
  PayrollDepartmentBreakdown,
  PayrollEmployee,
  PayrollMetricCardProps,
  PayrollScheduleItem,
  PayrollStatus,
  PayrollTab,
  PayrollTrendPoint,
} from "@/types/finance";

const employees: PayrollEmployee[] = [
  {
    id: "EMP001",
    name: "John Mwangi",
    department: "Sales",
    role: "Sales Manager",
    salary: 45000,
    advances: 0,
    deductions: 10000,
    netPay: 35000,
    bank: "Equity Bank ****4321",
    payDate: "2026-07-01",
    status: "paid",
  },
  {
    id: "EMP002",
    name: "Sarah Kipchoge",
    department: "G&A / Finance",
    role: "Accountant",
    salary: 38000,
    advances: 5000,
    deductions: 2400,
    netPay: 30600,
    bank: "KCB Bank ****8849",
    payDate: "2026-07-01",
    status: "paid",
  },
  {
    id: "EMP003",
    name: "James Kiplagat",
    department: "Operations",
    role: "Store Manager",
    salary: 32000,
    advances: 0,
    deductions: 8000,
    netPay: 24000,
    bank: "Co-op Bank ****1102",
    payDate: "2026-07-01",
    status: "scheduled",
  },
  {
    id: "EMP004",
    name: "Mary Kariuki",
    department: "Sales",
    role: "Cashier",
    salary: 18000,
    advances: 2000,
    deductions: 1200,
    netPay: 14800,
    bank: "NCBA Bank ****9931",
    payDate: "2026-07-01",
    status: "paid",
  },
  {
    id: "EMP005",
    name: "David Okoyo",
    department: "Operations",
    role: "Delivery Driver",
    salary: 22000,
    advances: 0,
    deductions: 5000,
    netPay: 17000,
    bank: "Absa Bank ****5541",
    payDate: "2026-07-01",
    status: "failed",
  },
];

const payRuns: PayRun[] = [
  { id: "PR-2026-06", period: "June 2026", employees: 352, gross: 185000, deductions: 10200, net: 174800, status: "paid", date: "2026-06-01" },
  { id: "PR-2026-05", period: "May 2026", employees: 341, gross: 179000, deductions: 9800, net: 169200, status: "paid", date: "2026-05-01" },
  { id: "PR-2026-04", period: "April 2026", employees: 328, gross: 171000, deductions: 10000, net: 161000, status: "failed", date: "2026-04-01" },
  { id: "PR-2026-03", period: "March 2026", employees: 321, gross: 166000, deductions: 9700, net: 156300, status: "paid", date: "2026-03-01" },
];

const payrollTrend: PayrollTrendPoint[] = [
  { month: "Jan", payroll: 142000 },
  { month: "Feb", payroll: 145000 },
  { month: "Mar", payroll: 148000 },
  { month: "Apr", payroll: 151000 },
  { month: "May", payroll: 153000 },
  { month: "Jun", payroll: 155000 },
];

const departments: PayrollDepartmentBreakdown[] = [
  { name: "Sales", count: 84, share: 24 },
  { name: "Operations", count: 78, share: 22 },
  { name: "Store Teams", count: 68, share: 19 },
  { name: "Finance", count: 22, share: 6 },
  { name: "Logistics", count: 38, share: 11 },
  { name: "Support", count: 62, share: 18 },
];

const scheduleItems: PayrollScheduleItem[] = [
  { label: "July 2026 base payroll", date: "2026-07-01", amount: 180000, status: "scheduled" },
  { label: "August 2026 base payroll", date: "2026-08-01", amount: 182500, status: "scheduled" },
  { label: "Q3 commissions and bonuses", date: "2026-09-15", amount: 45000, status: "scheduled" },
];

const complianceItems: PayrollComplianceItem[] = [
  { label: "PAYE tax settlement", due: "2026-06-30", tag: "KRA" },
  { label: "SHIF health insurance contribution", due: "2026-07-09", tag: "SHA" },
  { label: "NSSF Tier I and II remittance", due: "2026-07-09", tag: "NSSF" },
  { label: "Housing levy filing", due: "2026-07-20", tag: "KRA" },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function masked(show: boolean, value: number, short = false) {
  if (show) return formatCurrency(value);
  return short ? "****" : "******";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function StatusBadge({ status }: { status: PayrollStatus }) {
  const styles: Record<PayrollStatus, string> = {
    paid: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    scheduled: "bg-[#1A2846] text-[#D3E3F0] ring-1 ring-[#42688C]/30",
    failed: "bg-red-400/15 text-red-200 ring-1 ring-red-300/25",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
}: PayrollMetricCardProps) {
  return (
    <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#9CB4CA]">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-[#9CB4CA]">{helper}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export default function PayrollPage() {
  const [tab, setTab] = useState<PayrollTab>("employees");
  const [showTableFigures, setShowTableFigures] = useState(true);

  const totals = useMemo(() => {
    const gross = employees.reduce((sum, employee) => sum + employee.salary, 0);
    const advances = employees.reduce((sum, employee) => sum + employee.advances, 0);
    const deductions = employees.reduce((sum, employee) => sum + employee.deductions, 0);
    const net = employees.reduce((sum, employee) => sum + employee.netPay, 0);

    return { gross, advances, deductions, net };
  }, []);

  const tabs: Array<{ id: PayrollTab; label: string }> = [
    { id: "employees", label: "Employee Directory" },
    { id: "history", label: "Payment History" },
    { id: "schedule", label: "Pay Schedule & Compliance" },
  ];

  return (
    <PageLayout
      title="Salary & Payroll Management"
      subtitle="Employee compensation, advances, deductions, and pay runs"
      actions={
        <>
          <Button variant="outline" className="gap-2 text-xs">
            <UploadCloud className="h-3.5 w-3.5" /> Import
          </Button>
          <Button variant="outline" className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Payslips
          </Button>
          <Button className="gap-2 bg-[#42688C] text-xs text-white hover:bg-[#52789B]">
            <Send className="h-3.5 w-3.5" /> Process Payroll
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Monthly Payroll Cost"
            value={formatCurrency(totals.gross)}
            helper="June 2026 cycle"
            icon={Banknote}
          />
          <MetricCard
            label="Upcoming Pay Run"
            value={formatCurrency(180000)}
            helper="Scheduled for July 1, 2026"
            icon={CalendarClock}
          />
          <MetricCard
            label="Salary Advances"
            value={formatCurrency(totals.advances)}
            helper="Active payroll deductions"
            icon={FileText}
          />
          <MetricCard
            label="Net Release"
            value={formatCurrency(totals.net)}
            helper="After advances and deductions"
            icon={Users}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">Next Pay Run</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{formatCurrency(180000)}</h2>
                </div>
                <StatusBadge status="scheduled" />
              </div>

              <div className="mt-5 space-y-3 border-t border-[#42688C]/20 pt-4">
                {[
                  { label: "Base salaries", value: totals.gross },
                  { label: "Bonuses and commissions", value: 32000 },
                  { label: "Salary advance offsets", value: -totals.advances },
                  { label: "Statutory deductions", value: -totals.deductions },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#9CB4CA]">{item.label}</span>
                    <span className="font-semibold text-white">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-[#42688C]/50 px-4 text-sm font-semibold text-[#E2F4DF] transition hover:bg-[#42688C]/20">
              Preview and approve
            </button>
          </div>

          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">Headcount Breakdown</p>
            <div className="mt-4 space-y-3">
              {departments.map((department) => (
                <div key={department.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#B8CBE0]">{department.name}</span>
                    <span className="font-semibold text-white">{department.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#1A2846]">
                    <div className="h-full rounded-full bg-[#42688C]" style={{ width: `${department.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9CB4CA]">Payroll Trend</p>
                <p className="mt-1 text-sm text-[#9CB4CA]">Last six payroll cycles</p>
              </div>
              <span className="rounded-full bg-[#42688C]/20 px-2.5 py-1 text-xs font-semibold text-[#E2F4DF] ring-1 ring-[#42688C]/30">
                +9.2%
              </span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollTrend} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#42688C" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CB4CA", fontSize: 11 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: "#1A2846" }}
                    contentStyle={{
                      backgroundColor: "#0C0F1D",
                      border: "1px solid #42688C",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="payroll" name="Payroll" fill="#42688C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#42688C]/30 bg-[#13203A] px-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 overflow-x-auto">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 border-b-2 px-4 py-3.5 text-xs font-semibold transition ${
                    tab === item.id
                      ? "border-[#42688C] text-white"
                      : "border-transparent text-[#9CB4CA] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTableFigures((current) => !current)}
              className="mb-3 inline-flex items-center gap-2 self-start rounded-lg px-2 py-1.5 text-xs font-semibold text-[#9CB4CA] transition hover:bg-[#0C0F1D] hover:text-white sm:mb-0 sm:self-auto"
            >
              {showTableFigures ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {showTableFigures ? "Hide" : "Show"} table figures
            </button>
          </div>

          {tab === "employees" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                  <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3 text-right">Base Salary</th>
                    <th className="px-5 py-3 text-right">Advances</th>
                    <th className="px-5 py-3 text-right">Deductions</th>
                    <th className="px-5 py-3 text-right">Net Pay</th>
                    <th className="px-5 py-3">Pay Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-[#42688C]/20 transition last:border-0 hover:bg-[#13203A]">
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#42688C]/20 text-xs font-bold text-[#E2F4DF]">
                            {initials(employee.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-white">{employee.name}</p>
                            <p className="text-xs text-[#9CB4CA]">{employee.id} - {employee.bank}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{employee.role}</p>
                        <p className="text-xs text-[#9CB4CA]">{employee.department}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-white">{masked(showTableFigures, employee.salary, true)}</td>
                      <td className="px-5 py-4 text-right text-[#B8CBE0]">{employee.advances ? masked(showTableFigures, employee.advances, true) : "-"}</td>
                      <td className="px-5 py-4 text-right text-[#B8CBE0]">{employee.deductions ? masked(showTableFigures, employee.deductions, true) : "-"}</td>
                      <td className="px-5 py-4 text-right font-semibold text-[#E2F4DF]">{masked(showTableFigures, employee.netPay, true)}</td>
                      <td className="px-5 py-4 text-[#9CB4CA]">{employee.payDate}</td>
                      <td className="px-5 py-4"><StatusBadge status={employee.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "history" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                  <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                    <th className="px-5 py-3">Pay Run</th>
                    <th className="px-5 py-3">Period</th>
                    <th className="px-5 py-3 text-right">Employees</th>
                    <th className="px-5 py-3 text-right">Gross</th>
                    <th className="px-5 py-3 text-right">Deductions</th>
                    <th className="px-5 py-3 text-right">Net Released</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {payRuns.map((run) => (
                    <tr key={run.id} className="border-b border-[#42688C]/20 transition last:border-0 hover:bg-[#13203A]">
                      <td className="px-5 py-4 font-semibold text-white">{run.id}</td>
                      <td className="px-5 py-4 text-[#B8CBE0]">{run.period}</td>
                      <td className="px-5 py-4 text-right text-[#B8CBE0]">{run.employees}</td>
                      <td className="px-5 py-4 text-right font-semibold text-white">{formatCurrency(run.gross)}</td>
                      <td className="px-5 py-4 text-right text-red-200">{formatCurrency(run.deductions)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-[#E2F4DF]">{formatCurrency(run.net)}</td>
                      <td className="px-5 py-4"><StatusBadge status={run.status} /></td>
                      <td className="px-5 py-4 text-[#9CB4CA]">{run.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "schedule" && (
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-white">Upcoming Disbursements</h2>
                <div className="mt-3 space-y-3">
                  {scheduleItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-[#42688C]/30 bg-[#1A2846]/70 p-3">
                      <span className="h-2 w-2 rounded-full bg-[#42688C]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-[#9CB4CA]">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{formatCurrency(item.amount)}</p>
                        <div className="mt-1"><StatusBadge status={item.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">Statutory Deadlines</h2>
                <div className="mt-3 space-y-3">
                  {complianceItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-[#42688C]/30 bg-[#1A2846]/70 p-3">
                      <ShieldCheck className="h-4 w-4 text-[#9CB4CA]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-[#9CB4CA]">Due by {item.due}</p>
                      </div>
                      <span className="rounded-md border border-[#42688C]/30 bg-[#0C0F1D] px-2 py-1 text-xs font-semibold text-[#9CB4CA]">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#42688C]/30 bg-[#1A2846]/70 px-5 py-3 text-xs text-[#9CB4CA] sm:flex-row sm:items-center sm:justify-between">
            <span>Viewing June 2026 payroll settlement data</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "...", "18"].map((page) => (
                <button
                  key={page}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition ${
                    page === "1"
                      ? "border-[#42688C] bg-[#42688C]/20 font-bold text-[#E2F4DF]"
                      : "border-[#42688C]/30 text-[#9CB4CA] hover:bg-[#0C0F1D]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
