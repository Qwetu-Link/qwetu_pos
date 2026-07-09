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
    Checked: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    "Needs review": "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
    Waiting: "bg-[#1A2846] text-[#D3E3F0] ring-1 ring-[#42688C]/30",
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
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
            <ShieldCheck className="h-8 w-8 text-[#E2F4DF]" />
            Money Overview
          </h1>
          <p className="mt-1 text-[#9CB4CA]">
            A simple view of money coming in, money going out, payroll, refunds, and branch performance.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/finance-erp/payments"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#42688C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#52789B]"
          >
            View Payments
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/finance-erp/expense"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] px-4 py-2.5 text-sm font-semibold text-[#E2F4DF] transition hover:bg-[#13203A]"
          >
            Add Expense
          </Link>
        </div>
      </header>

      <KPICards />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Today at a Glance</h2>
              <p className="text-sm text-[#9CB4CA]">What needs attention today.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#9CB4CA]">Sales received</span>
              <span className="font-semibold text-[#E2F4DF]">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9CB4CA]">Expenses to check</span>
              <span className="font-semibold text-amber-200">7 items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9CB4CA]">Refunds waiting</span>
              <span className="font-semibold text-[#E2F4DF]">2 items</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Branches</h2>
              <p className="text-sm text-[#9CB4CA]">Stores that reported sales today.</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-white">12</p>
          <p className="mt-1 text-sm text-[#9CB4CA]">Active branches reporting today</p>
        </div>

        <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/15 text-amber-200">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">To-Do Items</h2>
              <p className="text-sm text-[#9CB4CA]">Simple money tasks waiting for action.</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-white">18</p>
          <p className="mt-1 text-sm text-[#9CB4CA]">Refunds, expenses, and payroll checks</p>
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
        <div className="overflow-hidden rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="border-b border-[#42688C]/20 px-5 py-4">
            <h2 className="text-lg font-bold text-white">Branch Money Summary</h2>
            <p className="text-sm text-[#9CB4CA]">Sales received by each branch today.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3 text-right">Sales</th>
                  <th className="px-5 py-3 text-right">Cash</th>
                  <th className="px-5 py-3 text-right">Mobile Money</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {branchSettlements.map((item) => (
                  <tr key={item.branch} className="border-b border-[#42688C]/20 last:border-0 hover:bg-[#13203A]">
                    <td className="px-5 py-4 font-semibold text-white">{item.branch}</td>
                    <td className="px-5 py-4 text-right font-semibold text-white">{item.sales}</td>
                    <td className="px-5 py-4 text-right text-[#B8CBE0]">{item.cash}</td>
                    <td className="px-5 py-4 text-right text-[#B8CBE0]">{item.mpesa}</td>
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-white">Common Tasks</h2>
          <p className="mt-1 text-sm text-[#9CB4CA]">The actions most users need day to day.</p>
          <div className="mt-4 space-y-3">
            {financeWork.map(({ label, detail, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#42688C]/30 p-4 transition hover:border-[#42688C]/50 hover:bg-[#42688C]/20"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A2846] text-[#D3E3F0]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{label}</p>
                    <p className="truncate text-sm text-[#9CB4CA]">{detail}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#7F9AB5]" />
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
