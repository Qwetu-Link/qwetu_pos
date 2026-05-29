import {
  formatCompactCurrency,
  formatCurrency,
  revenueData,
} from "@/lib/pos-details-data";

export default function RevenueTrendChart() {
  const maxRevenue = Math.max(
    ...revenueData.map((item) => item.fullPayments + item.installments),
  );
  const axisTicks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="grid min-h-80 grid-cols-[auto_1fr] gap-3">
        <div className="flex flex-col justify-between pb-8 text-right text-[11px] text-slate-400">
          {axisTicks.map((tick) => (
            <span key={tick}>{formatCompactCurrency(maxRevenue * tick)}</span>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 top-0 flex h-72 flex-col justify-between">
            {axisTicks.map((tick) => (
              <span key={tick} className="border-t border-slate-200" />
            ))}
          </div>
          <div className="relative flex h-80 items-end gap-4">
            {revenueData.map((item) => {
              const total = item.fullPayments + item.installments;
              const totalHeight = Math.max(8, (total / maxRevenue) * 100);
              const installmentShare = (item.installments / total) * 100;
              const fullShare = (item.fullPayments / total) * 100;

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col justify-end gap-2"
                >
                  <div className="flex flex-1 items-end justify-center">
                    <div
                      className="flex w-full max-w-11 flex-col overflow-hidden rounded-t-lg bg-blue-500 shadow-sm"
                      style={{ height: `${totalHeight}%` }}
                      title={`${item.month}: ${formatCurrency(total)}`}
                    >
                      <div
                        className="bg-purple-500"
                        style={{ height: `${installmentShare}%` }}
                        title={`Installments: ${formatCurrency(item.installments)}`}
                      />
                      <div
                        className="bg-blue-500"
                        style={{ height: `${fullShare}%` }}
                        title={`Full payments: ${formatCurrency(item.fullPayments)}`}
                      />
                    </div>
                  </div>
                  <p className="text-center text-xs font-medium text-slate-500">
                    {item.month}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-500" /> Full Payments
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-purple-500" /> Installments
        </span>
      </div>
    </div>
  );
}
