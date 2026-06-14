import { Plus, Download, Eye } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Accounts Receivable - Qwetulink Finance ERP',
  description: 'Manage customer debts and installments',
}

export default function AccountsReceivablePage() {
  const receivables = [
    { id: 1, customer: 'ABC Company', amount: 45000, balance: 25000, daysOverdue: 0, status: 'Current', installments: 3 },
    { id: 2, customer: 'XYZ Corp', amount: 120000, balance: 80000, daysOverdue: 15, status: '30 Days', installments: 5 },
    { id: 3, customer: 'Tech Ltd', amount: 35000, balance: 35000, daysOverdue: 45, status: '60 Days', installments: 2 },
    { id: 4, customer: 'Store Plus', amount: 65000, balance: 40000, daysOverdue: 0, status: 'Current', installments: 4 },
    { id: 5, customer: 'Retail Hub', amount: 92000, balance: 55000, daysOverdue: 62, status: '90 Days', installments: 6 },
  ]

  const agingBuckets = [
    { period: 'Current (0-30 days)', amount: 70000, count: 2 },
    { period: '30-60 Days', amount: 80000, count: 1 },
    { period: '60-90 Days', amount: 35000, count: 1 },
    { period: '90+ Days', amount: 55000, count: 1 },
  ]

  return (
      <PageLayout
        title="Accounts Receivable"
        subtitle="Manage customer debts, installments, and aging analysis"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Receivable
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
            <p className="text-sm font-medium text-muted-foreground">Total Receivables</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES 357,000</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 customers</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Current (0-30)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">KES 70,000</p>
            <p className="text-xs text-muted-foreground mt-1">On track</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Overdue (30+)</p>
            <p className="text-3xl font-bold text-red-600 mt-2">KES 170,000</p>
            <p className="text-xs text-muted-foreground mt-1">3 accounts</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Active Installments</p>
            <p className="text-3xl font-bold text-primary mt-2">21</p>
            <p className="text-xs text-muted-foreground mt-1">Contracts</p>
          </div>
        </div>

        {/* Aging Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aging Analysis</h3>
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Aging Period</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Count</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {agingBuckets.map((bucket, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{bucket.period}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">KES {bucket.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-foreground">{bucket.count}</td>
                      <td className="px-6 py-4 text-right text-foreground">{((bucket.amount / 357000) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer Receivables */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Receivables</h3>
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Original Amount</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Balance</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-center font-semibold text-foreground">Days Overdue</th>
                    <th className="px-6 py-3 text-center font-semibold text-foreground">Installments</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((rec) => (
                    <tr key={rec.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{rec.customer}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">KES {rec.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">KES {rec.balance.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rec.status === 'Current' ? 'bg-green-100 text-green-800' :
                          rec.status === '30 Days' ? 'bg-yellow-100 text-yellow-800' :
                          rec.status === '60 Days' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-foreground">{rec.daysOverdue}</td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">{rec.installments}</td>
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
