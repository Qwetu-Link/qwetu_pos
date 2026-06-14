import { Button } from '@/components/ui/button'
import { Users, Package, DollarSign, Download, ShoppingCart } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Reports - Qwetulink Finance ERP',
  description: 'Financial reports and business analytics',
}

export default function ReportsPage() {
  const reportCategories = [
    {
      category: 'Financial Reports',
      icon: DollarSign,
      reports: [
        { name: 'Profit & Loss Statement', description: 'Monthly income and expenses analysis', lastGenerated: '2024-06-14' },
        { name: 'Balance Sheet', description: 'Assets, liabilities, and equity overview', lastGenerated: '2024-06-14' },
        { name: 'Cash Flow Statement', description: 'Operating, investing, and financing activities', lastGenerated: '2024-06-13' },
        { name: 'General Ledger Report', description: 'Complete transaction history by account', lastGenerated: '2024-06-14' },
      ]
    },
    {
      category: 'Sales Reports',
      icon: ShoppingCart,
      reports: [
        { name: 'Sales Summary', description: 'Daily, weekly, and monthly sales totals', lastGenerated: '2024-06-14' },
        { name: 'Customer Analysis', description: 'Top customers, purchase frequency, and trends', lastGenerated: '2024-06-13' },
        { name: 'Product Performance', description: 'Best selling products and revenue contribution', lastGenerated: '2024-06-13' },
        { name: 'Payment Methods', description: 'Cash, M-Pesa, Bank, and Wallet breakdown', lastGenerated: '2024-06-14' },
      ]
    },
    {
      category: 'Inventory Reports',
      icon: Package,
      reports: [
        { name: 'Stock Status', description: 'Current inventory levels and reorder points', lastGenerated: '2024-06-14' },
        { name: 'Inventory Valuation', description: 'Total value of inventory at current prices', lastGenerated: '2024-06-13' },
        { name: 'Stock Movements', description: 'Inbound and outbound transactions', lastGenerated: '2024-06-12' },
        { name: 'Slow Moving Items', description: 'Products with low sales velocity', lastGenerated: '2024-06-12' },
      ]
    },
    {
      category: 'Payroll Reports',
      icon: Users,
      reports: [
        { name: 'Payroll Summary', description: 'Total salaries, deductions, and net pay', lastGenerated: '2024-06-01' },
        { name: 'Employee Payslips', description: 'Individual salary details and deductions', lastGenerated: '2024-06-01' },
        { name: 'Tax Report', description: 'PAYE and other tax obligations', lastGenerated: '2024-06-01' },
        { name: 'Attendance Report', description: 'Employee presence and leave tracking', lastGenerated: '2024-06-10' },
      ]
    },
  ]

  return (
      <PageLayout
        title="Reports Center"
        subtitle="Generate financial and business reports"
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export Selected
            </Button>
          </>
        }
      >
        <div className="space-y-8">
          {reportCategories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <div key={category.category}>
                <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{category.category}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {category.reports.map((report) => (
                    <div key={report.name} className="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{report.name}</h3>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-3 w-3" /> Export
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </PageLayout>
  )
}
