import {
  formatCompactCurrency,
  getInstallmentSchedule,
  paymentPlans,
  receipts,
} from "@/data/lipa-mdogo-data";

type ChartRow = {
  label: string;
  expected: number;
  collected: number;
};

export default function CollectionChart() {
  const rows = getCollectionRows();
  const maxAmount = Math.max(
    1,
    ...rows.flatMap((row) => [row.expected, row.collected]),
  );

  return (
    <div className="mt-8 rounded-xl bg-slate-50 p-4">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Collection Performance
          </h3>
          <p className="text-xs text-slate-500">
            Monthly expected installments against receipts
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
            Collected
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
            Expected
          </span>
        </div>
      </div>

      <div className="grid min-h-64 grid-cols-[auto_1fr] gap-3">
        <div className="flex flex-col justify-between pb-7 text-right text-[11px] text-slate-400">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <span key={ratio}>{formatCompactCurrency(maxAmount * ratio)}</span>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 top-0 flex h-56 flex-col justify-between">
            {[0, 1, 2, 3, 4].map((line) => (
              <span key={line} className="border-t border-slate-200" />
            ))}
          </div>
          <div className="relative flex h-64 items-end gap-3">
            {rows.map((row) => (
              <div key={row.label} className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex h-56 items-end justify-center gap-1.5">
                  <ChartBar
                    amount={row.collected}
                    maxAmount={maxAmount}
                    className="bg-emerald-600"
                  />
                  <ChartBar
                    amount={row.expected}
                    maxAmount={maxAmount}
                    className="bg-amber-500"
                  />
                </div>
                <span className="truncate text-center text-xs text-slate-500">
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartBar({
  amount,
  maxAmount,
  className,
}: {
  amount: number;
  maxAmount: number;
  className: string;
}) {
  const height = amount === 0 ? 4 : Math.max(8, (amount / maxAmount) * 100);

  return (
    <div
      className={`w-full max-w-8 rounded-t-md ${className}`}
      title={formatCompactCurrency(amount)}
      style={{ height: `${height}%` }}
    />
  );
}

function getCollectionRows(): ChartRow[] {
  const receiptMonths = receipts.map((receipt) => getMonthKey(receipt.date));
  const latestReceiptMonth = receiptMonths.sort().at(-1) ?? getMonthKey(new Date());
  const monthKeys = getMonthWindow(latestReceiptMonth, 6);

  return monthKeys.map((monthKey) => {
    const expected = paymentPlans.reduce((sum, plan) => {
      const dueForMonth = getInstallmentSchedule(plan).filter(
        (item) => getMonthKey(item.dueDate) === monthKey,
      );

      return (
        sum +
        dueForMonth.reduce((monthTotal, item) => monthTotal + item.amount, 0)
      );
    }, 0);
    const collected = receipts
      .filter((receipt) => getMonthKey(receipt.date) === monthKey)
      .reduce((sum, receipt) => sum + receipt.amount, 0);

    return {
      label: formatMonthLabel(monthKey),
      expected,
      collected,
    };
  });
}

function getMonthWindow(latestMonthKey: string, count: number) {
  const [year, month] = latestMonthKey.split("-").map(Number);
  const latestMonth = new Date(year, month - 1, 1);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(latestMonth);
    date.setMonth(latestMonth.getMonth() - (count - 1 - index));
    return getMonthKey(date);
  });
}

function getMonthKey(date: string | Date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-KE", {
    month: "short",
  });
}
