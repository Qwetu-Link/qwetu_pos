"use client";

import { Boxes, ChartColumnIncreasing, FolderOpen } from "lucide-react";
import type { CategoryStats } from "@/types/categories";

interface Props {
  stats: CategoryStats;
}

export default function CategoryStatsCards({ stats }: Props) {
  const cards = [
    {
      icon: FolderOpen,
      label: "Total Categories",
      value: stats.total,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Boxes,
      label: "Total Products",
      value: stats.totalProducts,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: ChartColumnIncreasing,
      label: "Avg. Products / Category",
      value: stats.avgProductsPerCategory,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`${card.bg} w-8 h-8 rounded-lg flex items-center justify-center text-base`}
            >
              <card.icon size={25} className={card.color} />
            </div>
            <p className={`text-sm font-semibold ${card.color}`}>{card.label}</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
