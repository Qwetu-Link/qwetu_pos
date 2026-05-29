import { PieChart } from "lucide-react";
import {
  categoryData,
  formatCompactCurrency,
} from "@/lib/pos-details-data";

export default function CategoryRingChart() {
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
      <div
        className="mx-auto h-48 w-48 rounded-full"
        style={{
          background: `conic-gradient(${categoryData
            .reduce(
              (parts, item) => {
                const start = parts.cursor;
                const end = start + (item.value / total) * 100;
                parts.segments.push(`${item.color} ${start}% ${end}%`);
                parts.cursor = end;
                return parts;
              },
              { cursor: 0, segments: [] as string[] },
            )
            .segments.join(", ")})`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full p-8">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <PieChart className="mb-1 h-5 w-5 text-slate-400" />
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCompactCurrency(total)}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {categoryData.map((item) => {
          const percentage = total ? (item.value / total) * 100 : 0;

          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatCompactCurrency(item.value)} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
