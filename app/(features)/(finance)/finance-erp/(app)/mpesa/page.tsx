import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'M-Pesa Management - Qwetulink Finance ERP',
  description: 'M-Pesa transactions and reconciliation',
}

export default function MPesaPage() {
  const transactions = [
    { id: 'MPESA001', date: '2024-06-14', time: '14:32:15', description: 'Payment from ABC Company', amount: 15000, balance: 285500, status: 'Success', reference: 'INV-001' },
    { id: 'MPESA002', date: '2024-06-14', time: '11:45:32', description: 'Salary Advance - John Mwangi', amount: -5000, balance: 270500, status: 'Success', reference: 'ADV-001' },
    { id: 'MPESA003', date: '2024-06-13', time: '16:22:44', description: 'Payment from Store Plus', amount: 31200, balance: 275500, status: 'Success', reference: 'INV-004' },
    { id: 'MPESA004', date: '2024-06-13', time: '09:15:00', description: 'Business Withdrawal', amount: -10000, balance: 244300, status: 'Success', reference: 'WITH-001' },
    { id: 'MPESA005', date: '2024-06-12', time: '13:50:12', description: 'Payment from Tech Ltd', amount: 8500, balance: 254300, status: 'Success', reference: 'INV-003' },
    { id: 'MPESA006', date: '2024-06-12', time: '10:30:00', description: 'Interest Credited', amount: 285, balance: 245800, status: 'Success', reference: 'INT-062024' },
  ]

  const summary = {
    balance: 285500,
    dailyInflow: 54700,
    dailyOutflow: 15000,
    successRate: 99.8,
    charges: 1200,
  }

  return (
      <PageLayout
        title="M-Pesa Management"
        subtitle="Track M-Pesa transactions and reconciliation"
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </>
        }
      >
        {/* M-Pesa Summary */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">M-Pesa Balance</p>
            <p className="text-2xl font-bold text-primary">KES {summary.balance.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Daily Inflow</p>
            <p className="text-2xl font-bold text-green-600">KES {summary.dailyInflow.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Daily Outflow</p>
            <p className="text-2xl font-bold text-red-600">KES {summary.dailyOutflow.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-foreground">{summary.successRate}%</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Charges (Month)</p>
            <p className="text-2xl font-bold text-foreground">KES {summary.charges.toLocaleString()}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Description</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Balance</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground text-xs">{transaction.id}</td>
                    <td className="px-6 py-4 text-foreground text-xs">
                      <div>{transaction.date}</div>
                      <div className="text-muted-foreground">{transaction.time}</div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{transaction.description}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''} KES {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">KES {transaction.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground text-xs">{transaction.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
  )
}
