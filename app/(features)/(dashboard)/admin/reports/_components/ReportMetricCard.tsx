import type { LucideIcon } from "lucide-react";

export default function ReportMetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 text-right text-xs font-medium text-slate-500">
          {detail}
        </span>
      </div>
      <div className="mt-4 min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
