import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Plus} from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Banking Management',
  description: 'Bank account management and reconciliation',
}

export default function BankingPage() {
  const bankAccounts = [
    { id: 1, name: 'Main Operations', bank: 'KCB Bank', accountNo: '****3456', balance: 2850000, currency: 'KES', status: 'Active' },
    { id: 2, name: 'Savings Account', bank: 'Equity Bank', accountNo: '****7890', balance: 1200000, currency: 'KES', status: 'Active' },
    { id: 3, name: 'Loan Account', bank: 'Diamond Bank', accountNo: '****2341', balance: -450000, currency: 'KES', status: 'Active' },
  ]

  const transfers = [
    { id: 1, date: '2024-06-10', from: 'Main Operations', to: 'Savings Account', amount: 500000, status: 'Completed', reference: 'TRF-001' },
    { id: 2, date: '2024-06-09', from: 'Savings Account', to: 'Main Operations', amount: 250000, status: 'Completed', reference: 'TRF-002' },
    { id: 3, date: '2024-06-08', from: 'Main Operations', to: 'Loan Account', amount: 100000, status: 'Pending', reference: 'TRF-003' },
    { id: 4, date: '2024-06-07', from: 'Savings Account', to: 'Main Operations', amount: 300000, status: 'Completed', reference: 'TRF-004' },
  ]

  const deposits = [
    { id: 1, date: '2024-06-10', account: 'Main Operations', amount: 1500000, source: 'Customer Collections', status: 'Cleared' },
    { id: 2, date: '2024-06-09', account: 'Savings Account', amount: 750000, source: 'Interest Earned', status: 'Pending' },
    { id: 3, date: '2024-06-08', account: 'Main Operations', amount: 2000000, source: 'Investor Funds', status: 'Cleared' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Active':
      case 'Cleared':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
      <PageLayout title="Banking Management" subtitle="Manage bank accounts, transfers, and deposits">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Total Deposits</p>
              <p className="mt-2 text-2xl font-bold text-foreground">KES 4,250,000</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" /> +12.5% vs last month
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Total Transfers</p>
              <p className="mt-2 text-2xl font-bold text-foreground">KES 1,150,000</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" /> 4 transfers this week
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Total Balance</p>
              <p className="mt-2 text-2xl font-bold text-foreground">KES 3,600,000</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" /> Across 3 accounts
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Pending Transfers</p>
              <p className="mt-2 text-2xl font-bold text-foreground">1</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                <TrendingDown className="h-3 w-3" /> KES 100,000
              </p>
            </div>
          </div>

          {/* Bank Accounts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Bank Accounts</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Account
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Account Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Bank</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Account Number</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Balance</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map((account) => (
                    <tr key={account.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-foreground">{account.name}</td>
                      <td className="px-6 py-3 text-foreground">{account.bank}</td>
                      <td className="px-6 py-3 text-foreground font-mono text-xs">{account.accountNo}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(account.balance)}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(account.status)}`}>
                          {account.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transfers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Recent Transfers</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Transfer
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">From Account</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">To Account</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Reference</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 text-foreground">{transfer.date}</td>
                      <td className="px-6 py-3 text-foreground">{transfer.from}</td>
                      <td className="px-6 py-3 text-foreground">{transfer.to}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(transfer.amount)}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{transfer.reference}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(transfer.status)}`}>
                          {transfer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deposits Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Deposits</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Record Deposit
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Account</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Source</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 text-foreground">{deposit.date}</td>
                      <td className="px-6 py-3 text-foreground">{deposit.account}</td>
                      <td className="px-6 py-3 text-foreground">{deposit.source}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(deposit.amount)}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
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
