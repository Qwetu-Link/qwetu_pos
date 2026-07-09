import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Filter, Plus, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import type { RefundRecord, RefundStatus } from "@/types/finance";
import { PageLayout } from "../../../_components/page-layout";

export const metadata = {
  title: "Refunds - Qwetu POS Financial Management",
  description: "Manage customer refund requests, approvals, and payouts",
};

const refunds: RefundRecord[] = [
  { id: "REF-001", date: "2026-07-09", customer: "ABC Company", invoice: "INV-001", amount: 5000, method: "M-Pesa reversal", reason: "Damaged product", status: "Approved", owner: "John Mwangi" },
  { id: "REF-002", date: "2026-07-08", customer: "XYZ Corp", invoice: "INV-002", amount: 7500, method: "Bank transfer", reason: "Wrong item shipped", status: "Processed", owner: "Sarah Kipchoge" },
  { id: "REF-003", date: "2026-07-08", customer: "Tech Ltd", invoice: "INV-003", amount: 2000, method: "Wallet credit", reason: "Customer request", status: "Pending", owner: "Unassigned" },
  { id: "REF-004", date: "2026-07-07", customer: "Store Plus", invoice: "INV-004", amount: 3500, method: "Cash payout", reason: "Quality issue", status: "Rejected", owner: "James Kiplagat" },
  { id: "REF-005", date: "2026-07-07", customer: "Retail Hub", invoice: "INV-005", amount: 8000, method: "Store credit", reason: "Partial return", status: "Approved", owner: "John Mwangi" },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function StatusBadge({ status }: { status: RefundStatus }) {
  const styles: Record<RefundStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    Approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    Processed: "bg-green-50 text-green-700 ring-1 ring-green-100",
    Rejected: "bg-red-50 text-red-700 ring-1 ring-red-100",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function RefundsPage() {
  const pending = refunds.filter((refund) => refund.status === "Pending");
  const approvedTotal = refunds
    .filter((refund) => refund.status === "Approved")
    .reduce((sum, refund) => sum + refund.amount, 0);
  const processedTotal = refunds
    .filter((refund) => refund.status === "Processed")
    .reduce((sum, refund) => sum + refund.amount, 0);
  const rejectedTotal = refunds
    .filter((refund) => refund.status === "Rejected")
    .reduce((sum, refund) => sum + refund.amount, 0);

  return (
    <PageLayout
      title="Refund Management"
      subtitle="Review refund requests, approve payouts, and track reversal methods"
      actions={
        <>
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> New Refund
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
            { label: "Pending Review", value: formatCurrency(pending.reduce((sum, refund) => sum + refund.amount, 0)), helper: `${pending.length} open request`, icon: RotateCcw },
            { label: "Approved", value: formatCurrency(approvedTotal), helper: "Awaiting payout", icon: ShieldCheck },
            { label: "Processed", value: formatCurrency(processedTotal), helper: "Completed reversals", icon: CheckCircle2 },
            { label: "Rejected", value: formatCurrency(rejectedTotal), helper: "Closed without payout", icon: XCircle },
          ].map(({ label, value, helper, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{helper}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Refund Ledger</h2>
              <p className="text-sm text-slate-500">Requests by customer, invoice, refund method, and approval owner</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Refund</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Reason</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((refund) => (
                    <tr key={refund.id} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{refund.id}</p>
                        <p className="text-xs text-slate-500">{refund.date} / {refund.invoice}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">{refund.customer}</td>
                      <td className="px-5 py-4 text-slate-500">{refund.reason}</td>
                      <td className="px-5 py-4 text-slate-900">{refund.method}</td>
                      <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(refund.amount)}</td>
                      <td className="px-5 py-4"><StatusBadge status={refund.status} /></td>
                      <td className="px-5 py-4 text-slate-500">{refund.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Review Queue</h2>
            <p className="mt-1 text-sm text-slate-500">Pending requests that need finance action.</p>
            <div className="mt-4 space-y-3">
              {pending.map((refund) => (
                <div key={refund.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{refund.customer}</p>
                      <p className="text-xs text-slate-500">{refund.invoice} / {refund.reason}</p>
                    </div>
                    <StatusBadge status={refund.status} />
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">{formatCurrency(refund.amount)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </PageLayout>
  );
}
