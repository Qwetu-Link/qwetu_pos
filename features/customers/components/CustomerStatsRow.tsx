import { Users, Star, TrendingUp, CreditCard } from "lucide-react";
import type { CustomerStats } from "@/types/customer";

export function CustomerStatsRow({ stats }: { stats: CustomerStats }) {
  const cards = [
    {
      label: "Total Customers",
      value: stats.total,
      Icon: Users,
      cls: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      label: "VIP Customers",
      value: stats.vipCount,
      Icon: Star,
      cls: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      label: "Active Plans",
      value: stats.activePlans,
      Icon: TrendingUp,
      cls: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Avg Spend",
      value: `KES ${(stats.avgSpend / 1000).toFixed(0)}K`,
      Icon: CreditCard,
      cls: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
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
          <p className="text-2xl font-extrabold text-slate-800">{value}</p>
        </div>
      ))}
    </div>
  );
}
