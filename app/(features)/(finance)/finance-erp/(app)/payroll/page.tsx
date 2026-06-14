import { Button } from '@/components/ui/button'
import { Plus, Download, Filter } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Payroll - Qwetulink Finance ERP',
  description: 'Employee payroll management and salary processing',
}

export default function PayrollPage() {
  const employees = [
    { id: 'EMP001', name: 'John Mwangi', position: 'Sales Manager', salary: 45000, status: 'Active', advances: 0, loans: 10000, lastPayslip: '2024-06-01' },
    { id: 'EMP002', name: 'Sarah Kipchoge', position: 'Accountant', salary: 38000, status: 'Active', advances: 5000, loans: 0, lastPayslip: '2024-06-01' },
    { id: 'EMP003', name: 'James Kiplagat', position: 'Store Manager', salary: 32000, status: 'Active', advances: 0, loans: 8000, lastPayslip: '2024-06-01' },
    { id: 'EMP004', name: 'Mary Kariuki', position: 'Cashier', salary: 18000, status: 'Active', advances: 2000, loans: 0, lastPayslip: '2024-06-01' },
    { id: 'EMP005', name: 'David Okoyo', position: 'Delivery Driver', salary: 22000, status: 'On Leave', advances: 0, loans: 5000, lastPayslip: '2024-06-01' },
  ]

  const payrollSummary = {
    totalPayroll: 155000,
    upcomingPayroll: 25000,
    advances: 7000,
    loans: 23000,
  }

  return (
      <PageLayout
        title="Payroll Management"
        subtitle="Process salaries, advances, loans, and deductions"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Process Payroll
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
        {/* Payroll Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Monthly Payroll</p>
            <p className="text-2xl font-bold text-foreground">KES {payrollSummary.totalPayroll.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Upcoming Payroll</p>
            <p className="text-2xl font-bold text-primary">KES {payrollSummary.upcomingPayroll.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Salary Advances</p>
            <p className="text-2xl font-bold text-foreground">KES {payrollSummary.advances.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Employee Loans</p>
            <p className="text-2xl font-bold text-foreground">KES {payrollSummary.loans.toLocaleString()}</p>
          </div>
        </div>

        {/* Employees Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Position</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Salary</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Advances</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Loans</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{employee.id}</td>
                    <td className="px-6 py-4 text-foreground">{employee.name}</td>
                    <td className="px-6 py-4 text-foreground text-muted-foreground">{employee.position}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">KES {employee.salary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-foreground">
                      {employee.advances > 0 ? `KES ${employee.advances.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-foreground">
                      {employee.loans > 0 ? `KES ${employee.loans.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
  )
}
