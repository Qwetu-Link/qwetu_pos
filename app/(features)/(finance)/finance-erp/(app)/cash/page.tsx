import { Button } from '@/components/ui/button'
import { TrendingUp, Plus } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Cash Management',
  description: 'Cash ledger and petty cash management',
}

export default function CashPage() {
  const cashSummary = [
    { name: 'Cash on Hand', amount: 450000, change: '+5.2%' },
    { name: 'Daily Collections', amount: 280000, change: '+8.1%' },
    { name: 'Petty Cash Float', amount: 50000, change: 'Stable' },
    { name: 'Bank Deposits', amount: 2500000, change: '+12.3%' },
  ]

  const cashTransactions = [
    { id: 1, date: '2024-06-10', type: 'Collection', description: 'Customer Payments', amount: 250000, method: 'Cash', balance: 450000 },
    { id: 2, date: '2024-06-10', type: 'Deposit', description: 'Bank Deposit', amount: -200000, method: 'Check', balance: 250000 },
    { id: 3, date: '2024-06-09', type: 'Collection', description: 'Over Counter Sales', amount: 180000, method: 'Cash', balance: 450000 },
    { id: 4, date: '2024-06-09', type: 'Expense', description: 'Office Supplies', amount: -15000, method: 'Petty Cash', balance: 35000 },
    { id: 5, date: '2024-06-08', type: 'Collection', description: 'Cash Returns', amount: 120000, method: 'Cash', balance: 335000 },
  ]

  const pettyExpenses = [
    { id: 1, date: '2024-06-10', category: 'Office Supplies', description: 'Stationery and Paper', amount: 5000, approver: 'John Doe' },
    { id: 2, date: '2024-06-10', category: 'Transportation', description: 'Taxi/Transport', amount: 3000, approver: 'Jane Smith' },
    { id: 3, date: '2024-06-09', category: 'Meals', description: 'Staff Lunch', amount: 4500, approver: 'Admin' },
    { id: 4, date: '2024-06-09', category: 'Office Maintenance', description: 'Cleaning Supplies', amount: 2500, approver: 'Manager' },
  ]

  return (
      <PageLayout title="Cash Management" subtitle="Monitor cash positions and petty cash expenses">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {cashSummary.map((item, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{item.name}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(item.amount)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" /> {item.change}
                </p>
              </div>
            ))}
          </div>

          {/* Cash Ledger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Cash Ledger</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Record Transaction
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Method</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {cashTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 text-foreground">{transaction.date}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type === 'Collection' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'Deposit' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-foreground">{transaction.description}</td>
                      <td className="px-6 py-3 text-foreground text-xs">{transaction.method}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(transaction.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Petty Cash */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Petty Cash Expenses</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Expense
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  {pettyExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 text-foreground">{expense.date}</td>
                      <td className="px-6 py-3 text-foreground font-medium">{expense.category}</td>
                      <td className="px-6 py-3 text-foreground">{expense.description}</td>
                      <td className="px-6 py-3 text-right font-semibold text-red-600">
                        -{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(expense.amount)}
                      </td>
                      <td className="px-6 py-3 text-foreground text-xs">{expense.approver}</td>
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
