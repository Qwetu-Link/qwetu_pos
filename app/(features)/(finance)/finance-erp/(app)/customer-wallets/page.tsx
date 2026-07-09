import { Button } from "@/components/ui/button";
import { Download, Eye, Plus, ReceiptText, ShieldCheck, Wallet, WalletCards } from "lucide-react";
import type { CustomerWallet, CustomerWalletActivity, CustomerWalletStatus, CustomerWalletTotals } from "@/types/finance";
import { PageLayout } from "../../../_components/page-layout";

export const metadata = {
  title: "Customer Wallets - Qwetu POS Financial Management",
  description: "Manage customer savings, store credit, refund credits, and wallet liability",
};

const wallets: CustomerWallet[] = [
  { id: "WAL-001", customer: "ABC Company", savings: 25000, storeCredit: 5000, refundCredit: 2500, total: 32500, status: "Active", lastTransaction: "2026-07-09" },
  { id: "WAL-002", customer: "XYZ Corp", savings: 45000, storeCredit: 0, refundCredit: 0, total: 45000, status: "Active", lastTransaction: "2026-07-08" },
  { id: "WAL-003", customer: "Tech Ltd", savings: 12000, storeCredit: 3000, refundCredit: 1500, total: 16500, status: "Watch", lastTransaction: "2026-07-07" },
  { id: "WAL-004", customer: "Store Plus", savings: 35000, storeCredit: 8000, refundCredit: 4000, total: 47000, status: "Active", lastTransaction: "2026-07-09" },
  { id: "WAL-005", customer: "Retail Hub", savings: 18000, storeCredit: 2000, refundCredit: 0, total: 20000, status: "Dormant", lastTransaction: "2026-07-03" },
];

const walletActivity: CustomerWalletActivity[] = [
  { id: "ACT-001", customer: "ABC Company", type: "Deposit", amount: 10000, date: "2026-07-09" },
  { id: "ACT-002", customer: "Store Plus", type: "Refund credit", amount: 4000, date: "2026-07-09" },
  { id: "ACT-003", customer: "XYZ Corp", type: "Purchase debit", amount: -8500, date: "2026-07-08" },
];

function formatCurrency(value: number) {
  const prefix = value < 0 ? "-KES " : "KES ";
  return `${prefix}${Math.abs(value).toLocaleString()}`;
}

function StatusBadge({ status }: { status: CustomerWalletStatus }) {
  const styles: Record<CustomerWalletStatus, string> = {
    Active: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    Watch: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
    Dormant: "bg-[#1A2846] text-[#D3E3F0] ring-1 ring-[#42688C]/30",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function CustomerWalletsPage() {
  const totals = wallets.reduce(
    (sum: CustomerWalletTotals, wallet) => ({
      savings: sum.savings + wallet.savings,
      storeCredit: sum.storeCredit + wallet.storeCredit,
      refundCredit: sum.refundCredit + wallet.refundCredit,
      total: sum.total + wallet.total,
    }),
    { savings: 0, storeCredit: 0, refundCredit: 0, total: 0 },
  );

  return (
    <PageLayout
      title="Customer Wallets"
      subtitle="Manage customer deposits, store credit, refund credit, and wallet liability controls"
      actions={
        <>
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
            <Plus className="h-4 w-4" /> New Deposit
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Wallet Liability", value: formatCurrency(totals.total), helper: `${wallets.length} customers`, icon: Wallet },
            { label: "Savings Deposits", value: formatCurrency(totals.savings), helper: "Customer-funded balances", icon: WalletCards },
            { label: "Store Credit", value: formatCurrency(totals.storeCredit), helper: "Issued by store teams", icon: ReceiptText },
            { label: "Refund Credits", value: formatCurrency(totals.refundCredit), helper: "Available refund value", icon: ShieldCheck },
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
            <div className="border-b border-[#42688C]/20 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Wallet Balances</h2>
              <p className="text-sm text-[#9CB4CA]">Customer wallet split by deposit, store credit, and refund credit.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                  <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3 text-right">Savings</th>
                    <th className="px-5 py-3 text-right">Store Credit</th>
                    <th className="px-5 py-3 text-right">Refund Credit</th>
                    <th className="px-5 py-3 text-right">Total Balance</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id} className="border-b border-[#42688C]/20 transition last:border-0 hover:bg-[#13203A]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{wallet.customer}</p>
                        <p className="text-xs text-[#9CB4CA]">{wallet.id} / Last activity {wallet.lastTransaction}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-white">{formatCurrency(wallet.savings)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-[#E2F4DF]">{formatCurrency(wallet.storeCredit)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-amber-200">{formatCurrency(wallet.refundCredit)}</td>
                      <td className="px-5 py-4 text-right font-bold text-white">{formatCurrency(wallet.total)}</td>
                      <td className="px-5 py-4"><StatusBadge status={wallet.status} /></td>
                      <td className="px-5 py-4">
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E2F4DF] transition hover:text-white">
                          <Eye className="h-4 w-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Recent Wallet Activity</h2>
              <div className="mt-4 space-y-3">
                {walletActivity.map((activity) => (
                  <div key={activity.id} className="rounded-lg border border-[#42688C]/30 bg-[#13203A] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{activity.customer}</p>
                        <p className="text-xs text-[#9CB4CA]">{activity.type} / {activity.date}</p>
                      </div>
                      <span className={`text-sm font-bold ${activity.amount >= 0 ? "text-[#E2F4DF]" : "text-red-200"}`}>
                        {formatCurrency(activity.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Wallet Controls</h2>
              <div className="mt-4 space-y-3 text-sm text-[#B8CBE0]">
                <div className="flex items-center justify-between border-b border-[#42688C]/20 pb-3">
                  <span>Wallet liability account</span>
                  <span className="font-semibold text-white">Balanced</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#42688C]/20 pb-3">
                  <span>Refund credit approvals</span>
                  <span className="font-semibold text-amber-200">2 pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dormant wallets</span>
                  <span className="font-semibold text-white">1 customer</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </PageLayout>
  );
}
