import { Button } from '@/components/ui/button'
import { Plus, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Reconciliation - Qwetulink Finance ERP',
  description: 'Reconcile cash, M-Pesa, bank, and wallet balances',
}

export default function ReconciliationPage() {
  const reconciliations = [
    {
      type: 'Cash',
      ledgerBalance: 125000,
      physicalCount: 125000,
      variance: 0,
      status: 'Reconciled',
      lastDate: '2024-06-13',
    },
    {
      type: 'M-Pesa',
      ledgerBalance: 280000,
      physicalCount: 278500,
      variance: -1500,
      status: 'Discrepancy',
      lastDate: '2024-06-13',
    },
    {
      type: 'Bank',
      ledgerBalance: 450000,
      physicalCount: 450000,
      variance: 0,
      status: 'Reconciled',
      lastDate: '2024-06-12',
    },
    {
      type: 'Customer Wallets',
      ledgerBalance: 161000,
      physicalCount: 161000,
      variance: 0,
      status: 'Reconciled',
      lastDate: '2024-06-13',
    },
  ]

  return (
      <PageLayout
        title="Reconciliation Module"
        subtitle="Reconcile physical counts with ledger balances for cash, M-Pesa, bank, and wallet accounts"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Reconciliation
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </>
        }
      >
        {/* Summary Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Ledger Balance</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES 1,016,000</p>
            <p className="text-xs text-muted-foreground mt-1">All accounts</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Physical Count</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES 1,014,500</p>
            <p className="text-xs text-muted-foreground mt-1">All accounts</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Variance</p>
            <p className="text-3xl font-bold text-red-600 mt-2">-KES 1,500</p>
            <p className="text-xs text-muted-foreground mt-1">Discrepancies</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Reconciliation Status</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">75%</p>
            <p className="text-xs text-muted-foreground mt-1">3 of 4 reconciled</p>
          </div>
        </div>

        {/* Reconciliation Details */}
        <div className="space-y-6">
          {reconciliations.map((recon, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{recon.type} Reconciliation</h3>
                  <p className="text-sm text-muted-foreground">Last reconciled: {recon.lastDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {recon.status === 'Reconciled' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" /> Reconciled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                      <AlertCircle className="h-4 w-4" /> Discrepancy
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Ledger Balance</p>
                  <p className="text-2xl font-bold text-foreground mt-2">KES {recon.ledgerBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Physical Count / Statement</p>
                  <p className="text-2xl font-bold text-foreground mt-2">KES {recon.physicalCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variance</p>
                  <p className={`text-2xl font-bold mt-2 ${recon.variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {recon.variance === 0 ? 'No' : recon.variance > 0 ? '+' : ''} KES {recon.variance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="gap-2">
                  View Transactions
                </Button>
                {recon.status !== 'Reconciled' && (
                  <Button className="gap-2">
                    Investigate Variance
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reconciliation History */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reconciliations</h3>
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Account Type</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Ledger Balance</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Physical Count</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Variance</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliations.map((recon, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{recon.type}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">KES {recon.ledgerBalance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">KES {recon.physicalCount.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${recon.variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        KES {recon.variance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {recon.status === 'Reconciled' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" /> Reconciled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="h-3 w-3" /> Discrepancy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground">{recon.lastDate}</td>
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
