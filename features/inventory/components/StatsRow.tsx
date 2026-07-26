import { CheckCircle2, TrendingUp, TriangleAlert, Truck } from "lucide-react";
import type { InventoryStats } from "@/types/inventory";

export function StatsRow({ stats }: { stats: InventoryStats }) {
  const cards = [
    {
      label: "Healthy SKUs",
      value: stats.healthy,
      Icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Low Stock",
      value: stats.low,
      Icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Critical",
      value: stats.critical,
      Icon: TriangleAlert,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Reorder Now",
      value: stats.reorder,
      Icon: Truck,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <p className={`text-sm font-bold ${color}`}>{label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
}
