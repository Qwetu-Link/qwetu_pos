import { CheckCircle2, TrendingUp, TriangleAlert, Truck } from "lucide-react";
import type { InventoryStats } from "@/types/inventory";

export function StatsRow({ stats }: { stats: InventoryStats }) {
  const cards = [
    {
      label: "Healthy SKUs",
      value: stats.healthy,
      Icon: CheckCircle2,
      cls: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Low Stock",
      value: stats.low,
      Icon: TrendingUp,
      cls: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      label: "Critical",
      value: stats.critical,
      Icon: TriangleAlert,
      cls: "text-orange-600",
      bg: "bg-orange-50 border-orange-100",
    },
    {
      label: "Reorder Now",
      value: stats.reorder,
      Icon: Truck,
      cls: "text-red-600",
      bg: "bg-red-50 border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, Icon, cls, bg }) => (
        <div
          key={label}
          className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${bg}`}
        >
          <div className={`flex items-center gap-2 mb-2 ${cls}`}>
            <Icon size={16} />
            <p className="text-sm font-semibold text-slate-700">{label}</p>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{value}</p>
        </div>
      ))}
    </div>
  );
}
