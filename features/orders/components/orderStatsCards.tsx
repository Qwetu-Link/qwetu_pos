import {
  Clock,
  CreditCard,
  Layers,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  iconBg,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function OrderStatsCards({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Total" value={stats.total} icon={Layers} accent="text-slate-600" iconBg="bg-slate-100" />
      <StatCard label="Pending" value={stats.pending} icon={Clock} accent="text-amber-600" iconBg="bg-amber-100" />
      <StatCard label="Processing" value={stats.processing} icon={CreditCard} accent="text-blue-600" iconBg="bg-blue-100" />
      <StatCard label="Shipped" value={stats.shipped} icon={Truck} accent="text-indigo-600" iconBg="bg-indigo-100" />
      <StatCard label="Delivered" value={stats.delivered} icon={PackageCheck} accent="text-emerald-600" iconBg="bg-emerald-100" />
      <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} accent="text-red-600" iconBg="bg-red-100" />
    </div>
  );
}
