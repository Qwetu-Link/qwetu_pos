import { Button } from "@/components/ui/button";
import {
  Banknote,
  Download,
  Filter,
  Plus,
  ReceiptText,
  Smartphone,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import type { SalesMethodSummary, SalesRecord, SalesStatus } from "@/types/finance";
import { PageLayout } from "../../../_components/page-layout";

export const metadata = {
  title: "Revenue - Qwetu POS Financial Management",
  description: "Revenue management, invoice tracking, and sales collections",
};

const sales: SalesRecord[] = [
  { invoice: "INV-001", customer: "ABC Company", products: "3 items", method: "M-Pesa", channel: "Till 542100", amount: 15000, status: "Paid", date: "2026-07-09" },
  { invoice: "INV-002", customer: "XYZ Corp", products: "5 items", method: "Cash", channel: "Main counter", amount: 22500, status: "Paid", date: "2026-07-09" },
  { invoice: "INV-003", customer: "Tech Ltd", products: "2 items", method: "Bank", channel: "Equity Bank", amount: 8500, status: "Pending", date: "2026-07-08" },
  { invoice: "INV-004", customer: "Store Plus", products: "7 items", method: "Card", channel: "POS terminal", amount: 31200, status: "Paid", date: "2026-07-08" },
  { invoice: "INV-005", customer: "Retail Hub", products: "4 items", method: "Wallet", channel: "Customer wallet", amount: 18900, status: "Overdue", date: "2026-07-07" },
];

const methodSummary: SalesMethodSummary[] = [
  { label: "M-Pesa", value: 15000, count: 1, icon: Smartphone },
  { label: "Cash", value: 22500, count: 1, icon: WalletCards },
  { label: "Bank", value: 8500, count: 1, icon: Banknote },
  { label: "Card & Wallet", value: 50100, count: 2, icon: ReceiptText },
];

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function StatusBadge({ status }: { status: SalesStatus }) {
  const styles: Record<SalesStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    Overdue: "bg-red-50 text-red-700 ring-1 ring-red-100",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function SalesPage() {
  const paidRevenue = sales
    .filter((sale) => sale.status === "Paid")
    .reduce((sum, sale) => sum + sale.amount, 0);
  const pendingRevenue = sales
    .filter((sale) => sale.status !== "Paid")
    .reduce((sum, sale) => sum + sale.amount, 0);
  const averageOrder = sales.reduce((sum, sale) => sum + sale.amount, 0) / sales.length;
  const overdueInvoices = sales.filter((sale) => sale.status === "Overdue");

  return (
    <PageLayout
      title="Revenue"
      subtitle="Track sales invoices, payment methods, collections, and overdue revenue"
      actions={
        <>
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> New Sale
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
            { label: "Collected Revenue", value: formatCurrency(paidRevenue), helper: "Settled invoices" },
            { label: "Pending Revenue", value: formatCurrency(pendingRevenue), helper: "Pending and overdue invoices" },
            { label: "Average Sale", value: formatCurrency(Math.round(averageOrder)), helper: "Across current sales" },
            { label: "Invoice Count", value: String(sales.length), helper: `${overdueInvoices.length} overdue` },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {methodSummary.map(({ label, value, count, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="mt-1 text-xs text-slate-500">{count} invoice{count === 1 ? "" : "s"}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xl font-bold text-slate-900">{formatCurrency(value)}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Revenue Ledger</h2>
              <p className="text-sm text-slate-500">Sales invoices by customer, method, amount, and collection status.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Products</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.invoice} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">{sale.invoice}</td>
                      <td className="px-5 py-4 font-medium text-slate-900">{sale.customer}</td>
                      <td className="px-5 py-4 text-slate-600">{sale.products}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{sale.method}</p>
                        <p className="text-xs text-slate-500">{sale.channel}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(sale.amount)}</td>
                      <td className="px-5 py-4"><StatusBadge status={sale.status} /></td>
                      <td className="px-5 py-4 text-slate-500">{sale.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Collection Review</h2>
              <p className="mt-1 text-sm text-slate-500">Invoices requiring follow-up from finance.</p>
              <div className="mt-4 space-y-3">
                {sales.filter((sale) => sale.status !== "Paid").map((sale) => (
                  <div key={sale.invoice} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{sale.customer}</p>
                        <p className="text-xs text-slate-500">{sale.invoice} / {sale.method}</p>
                      </div>
                      <StatusBadge status={sale.status} />
                    </div>
                    <p className="mt-3 text-xl font-bold text-slate-900">{formatCurrency(sale.amount)}</p>
                    <Button size="sm" className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700">
                      Follow Up
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                Revenue Signal
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">+12.4%</p>
              <p className="mt-1 text-sm text-slate-500">Collected revenue is above the previous period run-rate.</p>
            </div>
          </aside>
        </section>
      </div>
    </PageLayout>
  );
}
