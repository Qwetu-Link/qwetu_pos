
import { Button } from '@/components/ui/button'
import { Plus, Download, Eye } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Customer Wallets - Qwetulink Finance ERP',
  description: 'Manage customer savings and store credit',
}

export default function CustomerWalletsPage() {
  const wallets = [
    { id: 1, customer: 'ABC Company', savings: 25000, storeCredit: 5000, refundCredit: 2500, total: 32500, lastTransaction: '2024-06-12' },
    { id: 2, customer: 'XYZ Corp', savings: 45000, storeCredit: 0, refundCredit: 0, total: 45000, lastTransaction: '2024-06-11' },
    { id: 3, customer: 'Tech Ltd', savings: 12000, storeCredit: 3000, refundCredit: 1500, total: 16500, lastTransaction: '2024-06-10' },
    { id: 4, customer: 'Store Plus', savings: 35000, storeCredit: 8000, refundCredit: 4000, total: 47000, lastTransaction: '2024-06-13' },
    { id: 5, customer: 'Retail Hub', savings: 18000, storeCredit: 2000, refundCredit: 0, total: 20000, lastTransaction: '2024-06-09' },
  ]

  return (
      <PageLayout
        title="Customer Wallets"
        subtitle="Manage customer savings deposits, store credit, and refund credits"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Deposit
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Customer Wallets</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES 161,000</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 customers</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Savings Deposits</p>
            <p className="text-3xl font-bold text-green-600 mt-2">KES 135,000</p>
            <p className="text-xs text-muted-foreground mt-1">Future purchases</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Store Credit</p>
            <p className="text-3xl font-bold text-primary mt-2">KES 18,000</p>
            <p className="text-xs text-muted-foreground mt-1">Active credit</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Refund Credits</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">KES 8,000</p>
            <p className="text-xs text-muted-foreground mt-1">Pending use</p>
          </div>
        </div>

        {/* Wallet Details */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Wallet Balances</h3>
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Savings</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Store Credit</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Refund Credit</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Total Balance</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Last Transaction</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{wallet.customer}</td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">KES {wallet.savings.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">KES {wallet.storeCredit.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-orange-600">KES {wallet.refundCredit.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">KES {wallet.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-foreground">{wallet.lastTransaction}</td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:underline flex items-center gap-1">
                          <Eye className="h-4 w-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageLayout>
  )
}
