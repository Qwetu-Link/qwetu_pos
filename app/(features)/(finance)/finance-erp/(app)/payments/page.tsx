import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  Filter,
  Plus,
  ReceiptText,
  RefreshCcw,
  Smartphone,
  WalletCards,
} from "lucide-react";
import type { PaymentMethodSummary, PaymentRecord, PaymentStatus } from "@/types/finance";
import { PageLayout } from "../../../_components/page-layout";

export const metadata = {
  title: "Payments - Qwetu POS Financial Management",
  description: "Track customer payments, tenders, settlement status, and receipts",
};

const payments: PaymentRecord[] = [
  { id: "PAY-001", date: "2026-07-09", customer: "ABC Company", invoice: "INV-001", method: "M-Pesa", channel: "Till 542100", amount: 15000, fee: 42, status: "Settled", reference: "QJ92LQ01" },
  { id: "PAY-002", date: "2026-07-09", customer: "XYZ Corp", invoice: "INV-002", method: "Cash", channel: "Main counter", amount: 22500, fee: 0, status: "Settled", reference: "RCT-1842" },
  { id: "PAY-003", date: "2026-07-08", customer: "Tech Ltd", invoice: "INV-003", method: "Bank", channel: "Equity Bank", amount: 8500, fee: 120, status: "Pending", reference: "BNK-7782" },
  { id: "PAY-004", date: "2026-07-08", customer: "Store Plus", invoice: "INV-004", method: "Card", channel: "POS terminal", amount: 31200, fee: 624, status: "Settled", reference: "CARD-4421" },
  { id: "PAY-005", date: "2026-07-07", customer: "Retail Hub", invoice: "INV-005", method: "Wallet", channel: "Customer wallet", amount: 18900, fee: 0, status: "Failed", reference: "WAL-2059" },
];

const methodSummary: PaymentMethodSummary[] = [
  { label: "M-Pesa", value: 68200, count: 18, icon: Smartphone },
  { label: "Cash", value: 42300, count: 11, icon: WalletCards },
  { label: "Bank", value: 61500, count: 7, icon: ReceiptText },
  { label: "Card", value: 38800, count: 9, icon: CreditCard },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    Settled: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    Pending: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
    Failed: "bg-red-400/15 text-red-200 ring-1 ring-red-300/25",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function PaymentsPage() {
  const totalCollected = payments
    .filter((payment) => payment.status === "Settled")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const fees = payments.reduce((sum, payment) => sum + payment.fee, 0);

  return (
    <PageLayout
      title="Payments"
      subtitle="Track customer receipts, payment methods, fees, and settlement status"
      actions={
        <>
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
            <Plus className="h-4 w-4" /> Record Payment
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
            { label: "Settled Today", value: formatCurrency(totalCollected), helper: "4 successful receipts" },
            { label: "Pending Settlement", value: formatCurrency(pending), helper: "Requires confirmation" },
            { label: "Processing Fees", value: formatCurrency(fees), helper: "Across all channels" },
            { label: "Success Rate", value: "80.0%", helper: "Last 24 hours" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <p className="text-sm font-medium text-[#9CB4CA]">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-[#9CB4CA]">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {methodSummary.map(({ label, value, count, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-xs text-[#9CB4CA]">{count} payments</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#42688C]/20 text-[#E2F4DF]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xl font-bold text-white">{formatCurrency(value)}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#42688C]/20 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Payment Ledger</h2>
              <p className="text-sm text-[#9CB4CA]">Latest receipts by invoice and settlement channel</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Reconcile
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Fee</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#42688C]/20 transition last:border-0 hover:bg-[#13203A]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{payment.id}</p>
                      <p className="text-xs text-[#9CB4CA]">{payment.date} / {payment.invoice}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{payment.customer}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{payment.method}</p>
                      <p className="text-xs text-[#9CB4CA]">{payment.channel}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-white">{formatCurrency(payment.amount)}</td>
                    <td className="px-5 py-4 text-right text-[#9CB4CA]">{formatCurrency(payment.fee)}</td>
                    <td className="px-5 py-4"><StatusBadge status={payment.status} /></td>
                    <td className="px-5 py-4 text-xs font-medium text-[#9CB4CA]">{payment.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
