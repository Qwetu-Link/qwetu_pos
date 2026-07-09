import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import type { BranchMoneyStatus, BranchMoneySummary, FinanceTask } from "@/types/finance";
import { KPICards } from "../_components/kpi-cards";
import { PaymentMethodChart } from "../_components/payment-method-chart";
import { ProfitTrendsChart } from "../_components/profit-trends-chart";
import { RevenueChart } from "../_components/revenue-chart";

const branchSettlements: BranchMoneySummary[] = [
  {
    branch: "Nairobi CBD",
    sales: "KES 184,500",
    cash: "KES 52,300",
    mpesa: "KES 112,700",
    status: "Checked",
  },
  {
    branch: "Westlands",
    sales: "KES 126,800",
    cash: "KES 41,900",
    mpesa: "KES 76,400",
    status: "Needs review",
  },
  {
    branch: "Mombasa",
    sales: "KES 98,240",
    cash: "KES 29,700",
    mpesa: "KES 61,250",
    status: "Waiting",
  },
];

const financeWork: FinanceTask[] = [
  {
    label: "Add Expense",
    detail: "Record rent, supplies, transport, or other costs",
    href: "/finance-erp/expense",
    icon: ReceiptText,
  },
  {
    label: "Check Payments",
    detail: "See paid, pending, and failed customer payments",
    href: "/finance-erp/payments",
    icon: CreditCard,
  },
  {
    label: "Refund Customer",
    detail: "Create or review a customer refund",
    href: "/finance-erp/refunds",
    icon: ArrowRight,
  },
  {
    label: "View Reports",
    detail: "Simple sales, expenses, payroll, and branch reports",
    href: "/finance-erp/reports",
    icon: FileText,
  },
];

function StatusBadge({ status }: { status: BranchMoneyStatus }) {
  const styles: Record<BranchMoneyStatus, string> = {
    Checked: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    "Needs review": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    Waiting: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function FinDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
            Money Overview
          </h1>
          <p className="mt-1 text-slate-500">
            A simple view of money coming in, money going out, payroll, refunds, and branch performance.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/finance-erp/payments"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View Payments
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/finance-erp/expense"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Add Expense
          </Link>
        </div>
      </header>

      <KPICards />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Today at a Glance</h2>
              <p className="text-sm text-slate-500">What needs attention today.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Sales received</span>
              <span className="font-semibold text-emerald-700">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Expenses to check</span>
              <span className="font-semibold text-amber-700">7 items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Refunds waiting</span>
              <span className="font-semibold text-emerald-700">2 items</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Branches</h2>
              <p className="text-sm text-slate-500">Stores that reported sales today.</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-slate-900">12</p>
          <p className="mt-1 text-sm text-slate-500">Active branches reporting today</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">To-Do Items</h2>
              <p className="text-sm text-slate-500">Simple money tasks waiting for action.</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-slate-900">18</p>
          <p className="mt-1 text-sm text-slate-500">Refunds, expenses, and payroll checks</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <RevenueChart />
        </div>
        <PaymentMethodChart />
        <ProfitTrendsChart />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">Branch Money Summary</h2>
            <p className="text-sm text-slate-500">Sales received by each branch today.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3 text-right">Sales</th>
                  <th className="px-5 py-3 text-right">Cash</th>
                  <th className="px-5 py-3 text-right">Mobile Money</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {branchSettlements.map((item) => (
                  <tr key={item.branch} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{item.branch}</td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">{item.sales}</td>
                    <td className="px-5 py-4 text-right text-slate-600">{item.cash}</td>
                    <td className="px-5 py-4 text-right text-slate-600">{item.mpesa}</td>
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Common Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">The actions most users need day to day.</p>
          <div className="mt-4 space-y-3">
            {financeWork.map(({ label, detail, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="truncate text-sm text-slate-500">{detail}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
