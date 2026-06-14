import { Plus, Download, Eye } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Accounts Payable - Qwetulink Finance ERP',
  description: 'Manage supplier bills and payments',
}

export default function AccountsPayablePage() {
  const payables = [
    { id: 'INV001', supplier: 'Electronics Wholesale Ltd', amount: 125000, balance: 85000, dueDate: '2024-06-30', status: 'Pending' },
    { id: 'INV002', supplier: 'Furniture Imports Inc', amount: 85000, balance: 85000, dueDate: '2024-06-25', status: 'Overdue' },
    { id: 'INV003', supplier: 'Office Equipment Co', amount: 45000, balance: 0, dueDate: '2024-06-10', status: 'Paid' },
    { id: 'INV004', supplier: 'Accessories Distributor', amount: 45000, balance: 20000, dueDate: '2024-07-05', status: 'Partial' },
    { id: 'INV005', supplier: 'Maintenance Services Ltd', amount: 12000, balance: 12000, dueDate: '2024-06-28', status: 'Pending' },
  ]

  const agingBuckets = [
    { period: 'Current (0-30 days)', amount: 105000, count: 2 },
    { period: '30-60 Days', amount: 85000, count: 1 },
    { period: '60-90 Days', amount: 12000, count: 1 },
    { period: '90+ Days', amount: 0, count: 0 },
  ]

  return (
      <PageLayout
        title="Accounts Payable"
        subtitle="Manage supplier bills, purchase orders, and payment schedules"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Bill
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
            <p className="text-sm font-medium text-muted-foreground">Total Payables</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES 202,000</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 suppliers</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Due Soon (0-30)</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">KES 105,000</p>
            <p className="text-xs text-muted-foreground mt-1">2 bills</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Overdue</p>
            <p className="text-3xl font-bold text-red-600 mt-2">KES 85,000</p>
            <p className="text-xs text-muted-foreground mt-1">1 bill</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Paid</p>
            <p className="text-3xl font-bold text-green-600 mt-2">KES 45,000</p>
            <p className="text-xs text-muted-foreground mt-1">1 bill</p>
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
                      <td className="px-6 py-4 text-right text-foreground">{bucket.amount > 0 ? ((bucket.amount / 202000) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Supplier Payables */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Bills</h3>
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Invoice</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Supplier</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Balance</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Due Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payables.map((payable) => (
                    <tr key={payable.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{payable.id}</td>
                      <td className="px-6 py-4 text-foreground">{payable.supplier}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">KES {payable.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">KES {payable.balance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-foreground">{payable.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payable.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          payable.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                          payable.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payable.status}
                        </span>
                      </td>
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
