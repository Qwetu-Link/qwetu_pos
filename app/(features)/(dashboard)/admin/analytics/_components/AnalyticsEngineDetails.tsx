import {
  AlertTriangle,
  Banknote,
  BarChart3,
  CalendarClock,
  CreditCard,
  Download,
  Receipt,
  Repeat2,
  Users,
  WalletCards,
} from "lucide-react";
import {
  customerSegmentData,
  formatCompactCurrency,
  formatCurrency,
  paymentMethodData,
  previousRevenueData,
  revenueData,
} from "@/lib/pos-details-data";
import EmptyState from "@/components/EmptyState";
import CategoryRingChart from "./CategoryRingChart";
import CollectionTrendChart from "./CollectionTrendChart";
import InfoRow from "./InfoRow";
import MetricCard from "./MetricCard";
import PaymentMethodIcon from "./PaymentMethodIcon";
import RevenueTrendChart from "./RevenueTrendChart";
import SectionCard from "./SectionCard";

export default function AnalyticsEngineDetails() {
  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + item.fullPayments + item.installments,
    0,
  );
  const previousRevenue = previousRevenueData.reduce(
    (sum, item) => sum + item.fullPayments + item.installments,
    0,
  );
  const totalOrders = 1826;
  const previousOrders = 1394;
  const activeCustomers = customerSegmentData.reduce(
    (sum, item) => sum + item.customers,
    0,
  );
  const previousCustomers = 238;
  const avgOrderValue = totalRevenue / totalOrders;
  const previousAvgOrderValue = previousRevenue / previousOrders;
  const installmentRevenue = revenueData.reduce(
    (sum, item) => sum + item.installments,
    0,
  );
  const installmentPercentage = totalRevenue
    ? (installmentRevenue / totalRevenue) * 100
    : 0;
  const overduePlans = 11;
  const defaultRate = 4.8;
  const newCustomers = 96;
  const returningCustomers = 74;
  const retentionRate = activeCustomers
    ? (returningCustomers / activeCustomers) * 100
    : 0;
  const customerLtv = activeCustomers ? totalRevenue / activeCustomers : 0;
  // const topPaymentMethod = paymentMethodData[0];

  return (
    <div className="space-y-6 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
            <BarChart3 className="h-8 w-8 text-emerald-600" />
            Analytics Engine
          </h1>
          <p className="mt-1 text-slate-500">
            Business intelligence and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-xl border text-black border-slate-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
          <button className="inline-flex text-black items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={formatCompactCurrency(totalRevenue)}
          current={totalRevenue}
          previous={previousRevenue}
          tone="text-emerald-600"
          icon={Banknote}
        />
        <MetricCard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          current={totalOrders}
          previous={previousOrders}
          tone="text-blue-600"
          icon={Receipt}
        />
        <MetricCard
          label="Active Customers"
          value={activeCustomers.toLocaleString()}
          current={activeCustomers}
          previous={previousCustomers}
          tone="text-purple-600"
          icon={Users}
        />
        <MetricCard
          label="Avg Order Value"
          value={formatCompactCurrency(avgOrderValue)}
          current={avgOrderValue}
          previous={previousAvgOrderValue}
          tone="text-amber-600"
          icon={WalletCards}
        />
      </section>

      <SectionCard>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Trends
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Breakdown of full payments vs installment revenue (Dec 25 - May 26)
          </p>
        </div>
        <RevenueTrendChart />
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Sales by Category
            </h2>
            <p className="text-sm text-slate-500">Last 6 Months performance</p>
          </div>
          <CategoryRingChart />
        </SectionCard>

        <SectionCard>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Customer Segments
            </h2>
            <p className="text-sm text-slate-500">Revenue by customer tier</p>
          </div>
          {customerSegmentData.length === 0 ? (
            <EmptyState
              compact
              icon={Users}
              title="No customer segment data"
              description="Customer tier performance will appear once backend customer analytics are available."
            />
          ) : (
          <div className="space-y-4">
            {customerSegmentData.map((segment) => {
              const maxRevenue = Math.max(
                ...customerSegmentData.map((item) => item.revenue),
              );
              const width = maxRevenue ? (segment.revenue / maxRevenue) * 100 : 0;

              return (
                <div
                  key={segment.segment}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {segment.segment}
                      </p>
                      <p className="text-xs text-slate-500">
                        {segment.customers} customers
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-700">
                      KES {formatCompactCurrency(segment.revenue)}
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Methods
          </h2>
          <p className="text-sm text-slate-500">
            Transaction volume and amounts
          </p>
        </div>
        {paymentMethodData.length === 0 ? (
          <EmptyState
            compact
            icon={CreditCard}
            title="No payment method data"
            description="Tender split and transaction volume will appear once payments are available."
          />
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paymentMethodData.map((method) => (
            <div
              key={method.method}
              className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <PaymentMethodIcon method={method.method} />
                  </span>
                  <p className="text-sm font-semibold text-slate-700">
                    {method.method}
                  </p>
                </div>
              </div>
              <p className="mb-1 text-2xl font-bold text-slate-800">
               KES {formatCompactCurrency(method.amount)}
              </p>
              <p className="text-xs text-slate-500">
                {method.transactions.toLocaleString()} transactions
              </p>
            </div>
          ))}
        </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <CalendarClock className="h-5 w-5 text-emerald-600" />
            Plan Duration Analysis
          </h3>
          <div className="space-y-4">
            {[2, 3, 6, 9].map((months, index) => {
              const percentage = [25, 16, 39, 20][index];

              return (
                <div key={months}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm text-black">{months} Months</span>
                    <span className="text-sm font-medium text-emerald-600">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 border-t pt-4 text-sm text-slate-500">
            Based on active and historical payment plans.
          </p>
        </SectionCard>

        <SectionCard>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Installment Insights
          </h3>
          <div className="text-center">
            <p className="mb-2 text-4xl font-bold text-emerald-600">
              {installmentPercentage.toFixed(1)}%
            </p>
            <p className="mb-4 text-sm text-slate-500">
              of total revenue from installments
            </p>
          </div>
          <div className="space-y-2 border-t pt-4 text-md">
            <InfoRow
              label="Installment revenue"
              value={formatCurrency(installmentRevenue)}
            />
            <InfoRow
              label="Overdue plans"
              value={String(overduePlans)}
              valueClassName="text-red-600"
              icon={AlertTriangle}
            />
            <InfoRow
              label="Default rate"
              value={`${defaultRate}%`}
              valueClassName="text-red-600"
            />
          </div>
        </SectionCard>

        <SectionCard>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Repeat2 className="h-5 w-5 text-blue-600" />
            Customer Retention
          </h3>
          <div className="text-center">
            <p className="mb-2 text-4xl font-bold text-blue-600">
              {retentionRate.toFixed(1)}%
            </p>
            <p className="mb-4 text-md text-slate-500">Repeat customers rate</p>
          </div>
          <div className="space-y-2 border-t pt-4 text-md">
            <InfoRow label="New customers" value={String(newCustomers)} />
            <InfoRow
              label="Returning customers"
              value={String(returningCustomers)}
            />
            <InfoRow label="Customer LTV" value={formatCurrency(customerLtv)} />
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Collection Performance Trend
        </h3>
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-slate-300" /> Expected
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-emerald-500" /> Collected
          </span>
        </div>
        <CollectionTrendChart />
      </SectionCard>
    </div>
  );
}
