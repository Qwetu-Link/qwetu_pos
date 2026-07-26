import type { LucideIcon } from "lucide-react";

export default function TransactionStatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-2 flex items-center gap-2 ${tone}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
