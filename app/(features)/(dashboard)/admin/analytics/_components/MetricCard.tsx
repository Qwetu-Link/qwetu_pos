import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPercentChange } from "@/lib/pos-details-data";

export default function MetricCard({
  label,
  value,
  current,
  previous,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  tone: string;
  icon: LucideIcon;
}) {
  const change = getPercentChange(current, previous);
  const positive = change === null || change >= 0;
  const ChangeIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className={`mb-3 flex items-center gap-2 ${tone}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div
        className={`mt-2 flex items-center gap-1.5 text-sm ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        <ChangeIcon className="h-3.5 w-3.5" />
        <span>
          {change === null
            ? "No previous data"
            : `${Math.abs(change).toFixed(1)}% vs previous period`}
        </span>
      </div>
    </div>
  );
}
