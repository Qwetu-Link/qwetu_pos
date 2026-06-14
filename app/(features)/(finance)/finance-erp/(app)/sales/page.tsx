import { Button } from '@/components/ui/button'
import { Plus, Download, Filter } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Sales - Qwetulink Finance ERP',
  description: 'Sales management and invoice tracking',
}

export default function SalesPage() {
  const sales = [
    { invoice: 'INV-001', customer: 'ABC Company', products: '3 items', method: 'M-Pesa', amount: 15000, status: 'Paid', date: '2024-06-14' },
    { invoice: 'INV-002', customer: 'XYZ Corp', products: '5 items', method: 'Cash', amount: 22500, status: 'Paid', date: '2024-06-13' },
    { invoice: 'INV-003', customer: 'Tech Ltd', products: '2 items', method: 'Bank', amount: 8500, status: 'Pending', date: '2024-06-12' },
    { invoice: 'INV-004', customer: 'Store Plus', products: '7 items', method: 'Wallet', amount: 31200, status: 'Paid', date: '2024-06-11' },
    { invoice: 'INV-005', customer: 'Retail Hub', products: '4 items', method: 'M-Pesa', amount: 18900, status: 'Overdue', date: '2024-06-10' },
  ]

  return (
      <PageLayout
        title="Sales"
        subtitle="Track and manage all sales transactions"
        actions={
          <>
            <Button className="gap-2">
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
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Invoice</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Products</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Method</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.invoice} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{sale.invoice}</td>
                    <td className="px-6 py-4 text-foreground">{sale.customer}</td>
                    <td className="px-6 py-4 text-foreground">{sale.products}</td>
                    <td className="px-6 py-4 text-foreground">{sale.method}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">KES {sale.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
  )
}
