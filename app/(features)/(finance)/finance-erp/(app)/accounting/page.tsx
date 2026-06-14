import { Plus, Download, Filter } from "lucide-react";
import { PageLayout } from "../../../_components/page-layout";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Accounting - Qwetulink Finance ERP",
  description: "General ledger and accounting records",
};

export default function AccountingPage() {
  const ledgerEntries = [
    {
      date: "2024-06-14",
      account: "Sales Revenue",
      debit: 0,
      credit: 35400,
      balance: 285500,
    },
    {
      date: "2024-06-14",
      account: "Cash in Hand",
      debit: 35400,
      credit: 0,
      balance: 145000,
    },
    {
      date: "2024-06-13",
      account: "Sales Revenue",
      debit: 0,
      credit: 22500,
      balance: 250100,
    },
    {
      date: "2024-06-13",
      account: "Bank Account",
      debit: 22500,
      credit: 0,
      balance: 127600,
    },
    {
      date: "2024-06-12",
      account: "Accounts Receivable",
      debit: 8500,
      credit: 0,
      balance: 89100,
    },
    {
      date: "2024-06-12",
      account: "Cost of Goods Sold",
      debit: 5100,
      credit: 0,
      balance: 142000,
    },
    {
      date: "2024-06-11",
      account: "Inventory",
      debit: 0,
      credit: 15600,
      balance: 136900,
    },
    {
      date: "2024-06-11",
      account: "Sales Revenue",
      debit: 0,
      credit: 31200,
      balance: 252600,
    },
  ];

  const summary = {
    opening: 125000,
    debits: 49000,
    credits: 89100,
    closing: 84900,
  };

  return (
    <PageLayout
      title="General Ledger"
      subtitle="View all accounting transactions and balances"
      actions={
        <>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Journal Entry
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
      {/* Summary Panel */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Opening Balance</p>
          <p className="text-2xl font-bold text-foreground">
            KES {summary.opening.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Debits</p>
          <p className="text-2xl font-bold text-foreground">
            KES {summary.debits.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <p className="text-2xl font-bold text-foreground">
            KES {summary.credits.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 bg-primary/5">
          <p className="text-sm text-muted-foreground">Closing Balance</p>
          <p className="text-2xl font-bold text-primary">
            KES {summary.closing.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Account
                </th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">
                  Debit
                </th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">
                  Credit
                </th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-muted-foreground">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {entry.account}
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">
                    {entry.debit > 0
                      ? `KES ${entry.debit.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">
                    {entry.credit > 0
                      ? `KES ${entry.credit.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    KES {entry.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
