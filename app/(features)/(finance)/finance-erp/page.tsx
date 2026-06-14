import { KPICards } from "../_components/kpi-cards";
import { PaymentMethodChart } from "../_components/payment-method-chart";
import { ProfitTrendsChart } from "../_components/profit-trends-chart";
import { ReceivablesChart } from "../_components/receivables-chart";
import { RevenueChart } from "../_components/revenue-chart";

export default function FinDashboard() {
  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Dashboard</h1>
            <p className="text-slate-500 font-medium">
              Welcome back to Qwetu<span className="text-emerald-600">Links</span> Finance ERP
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <RevenueChart />
          </div>
          <PaymentMethodChart />
          <ProfitTrendsChart />
          <div className="md:col-span-2">
            <ReceivablesChart />
          </div>
        </div>
      </div>
    </div>
  );
}