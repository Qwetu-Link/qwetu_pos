import { Button } from "@/components/ui/button";
import { expenses, formatCurrency, formatDate } from "@/data/transaction-data";
import type { FinanceExpenseCategoryTotals, FinanceExpenseStatus } from "@/types/finance";
import {
  Clock3,
  Download,
  Filter,
  Plus,
  Receipt,
  ShieldCheck,
  WalletCards,
  XCircle,
} from "lucide-react";
import { PageLayout } from "../../../_components/page-layout";

export const metadata = {
  title: "Expenses - Qwetu POS Financial Management",
  description: "Review operating expenses, vendors, methods, and approval status",
};

const statusStyles: Record<FinanceExpenseStatus, string> = {
  approved: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
  pending: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
  rejected: "bg-red-400/15 text-red-200 ring-1 ring-red-300/25",
};

function StatusBadge({ status }: { status: FinanceExpenseStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export default function ExpensePage() {
  const approvedTotal = expenses
    .filter((expense) => expense.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = expenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const rejectedCount = expenses.filter((expense) => expense.status === "rejected").length;
  const pendingExpenses = expenses.filter((expense) => expense.status === "pending");

  const categoryTotals = expenses.reduce<FinanceExpenseCategoryTotals>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
    return totals;
  }, {});

  return (
    <PageLayout
      title="Expenses"
      subtitle="Review operating spend, vendor payments, approval status, and category exposure"
      actions={
        <>
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Approved Spend", value: formatCurrency(approvedTotal), helper: "Ready for payment records", icon: WalletCards },
            { label: "Pending Spend", value: formatCurrency(pendingTotal), helper: "Waiting for approval", icon: Clock3 },
            { label: "Expense Records", value: String(expenses.length), helper: "Current register entries", icon: Receipt },
            { label: "Rejected Claims", value: String(rejectedCount), helper: "Not approved for payment", icon: XCircle },
          ].map(({ label, value, helper, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#9CB4CA]">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs text-[#9CB4CA]">{helper}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#42688C]/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Expense Register</h2>
                <p className="text-sm text-[#9CB4CA]">Operational expenses grouped by vendor, method, and approval state.</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <ShieldCheck className="h-4 w-4" /> Approval Rules
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                  <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                    <th className="px-5 py-3">Expense</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Vendor</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-[#42688C]/20 transition last:border-0 hover:bg-[#13203A]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{expense.id}</p>
                        <p className="text-xs text-[#9CB4CA]">{expense.note}</p>
                      </td>
                      <td className="px-5 py-4 text-[#9CB4CA]">{formatDate(expense.date)}</td>
                      <td className="px-5 py-4 font-medium text-white">{expense.category}</td>
                      <td className="px-5 py-4 text-[#B8CBE0]">{expense.vendor}</td>
                      <td className="px-5 py-4 text-[#9CB4CA]">{expense.method}</td>
                      <td className="px-5 py-4 text-right font-semibold text-white">{formatCurrency(expense.amount)}</td>
                      <td className="px-5 py-4"><StatusBadge status={expense.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <aside className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Approval Queue</h2>
              <p className="mt-1 text-sm text-[#9CB4CA]">Pending expenses that need review.</p>
              <div className="mt-4 space-y-3">
                {pendingExpenses.map((expense) => (
                  <div key={expense.id} className="rounded-lg border border-[#42688C]/30 bg-[#13203A] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{expense.vendor}</p>
                        <p className="text-xs text-[#9CB4CA]">{expense.category}</p>
                      </div>
                      <StatusBadge status={expense.status} />
                    </div>
                    <p className="mt-3 text-xl font-bold text-white">{formatCurrency(expense.amount)}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button size="sm" className="bg-[#42688C] text-white hover:bg-[#52789B]">Approve</Button>
                      <Button size="sm" variant="outline">Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <aside className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Category Exposure</h2>
              <div className="mt-4 space-y-3">
                {Object.entries(categoryTotals).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between gap-4 border-b border-[#42688C]/20 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-[#B8CBE0]">{category}</span>
                    <span className="text-sm font-semibold text-white">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
