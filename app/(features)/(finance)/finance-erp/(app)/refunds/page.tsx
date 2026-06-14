import { Button } from '@/components/ui/button'
import { Plus, Download, Filter } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Refunds - Qwetulink Finance ERP',
  description: 'Manage customer refund requests and processing',
}

export default function RefundsPage() {
  const refunds = [
    { id: 'REF001', date: '2024-06-14', customer: 'ABC Company', invoice: 'INV-001', amount: 5000, reason: 'Damaged Product', status: 'Approved', approvedBy: 'John Mwangi', approvalDate: '2024-06-14' },
    { id: 'REF002', date: '2024-06-13', customer: 'XYZ Corp', invoice: 'INV-002', amount: 7500, reason: 'Wrong Item Shipped', status: 'Processed', approvedBy: 'Sarah Kipchoge', approvalDate: '2024-06-13' },
    { id: 'REF003', date: '2024-06-12', customer: 'Tech Ltd', invoice: 'INV-003', amount: 2000, reason: 'Customer Request', status: 'Pending', approvedBy: 'Pending', approvalDate: '-' },
    { id: 'REF004', date: '2024-06-11', customer: 'Store Plus', invoice: 'INV-004', amount: 3500, reason: 'Quality Issue', status: 'Rejected', approvedBy: 'James Kiplagat', approvalDate: '2024-06-11' },
    { id: 'REF005', date: '2024-06-10', customer: 'Retail Hub', invoice: 'INV-005', amount: 8000, reason: 'Partial Return', status: 'Approved', approvedBy: 'John Mwangi', approvalDate: '2024-06-11' },
  ]

  const summary = {
    pending: 2000,
    approved: 16500,
    processed: 7500,
    rejected: 3500,
  }

  return (
      <PageLayout
        title="Refund Management"
        subtitle="Track and process customer refund requests"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Refund Request
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
        {/* Refund Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 bg-yellow-50">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">KES {summary.pending.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 bg-blue-50">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-blue-600">KES {summary.approved.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">Processed</p>
            <p className="text-2xl font-bold text-primary">KES {summary.processed.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 bg-red-50">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-red-600">KES {summary.rejected.toLocaleString()}</p>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Refund ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Invoice</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Reason</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Approved By</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{refund.id}</td>
                    <td className="px-6 py-4 text-foreground text-muted-foreground">{refund.date}</td>
                    <td className="px-6 py-4 text-foreground">{refund.customer}</td>
                    <td className="px-6 py-4 text-foreground text-xs">{refund.invoice}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">KES {refund.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-foreground text-muted-foreground">{refund.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        refund.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        refund.status === 'Processed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">{refund.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
  )
}
