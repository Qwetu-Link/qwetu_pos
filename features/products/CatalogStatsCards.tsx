"use client";

import { formatCompactCurrency } from "@/utils/catalog-utils";
import { CatalogStats } from "@/types/catalog";
import { BadgeAlert, Box, ChartColumnIncreasing, Tag } from "lucide-react";

interface Props {
  stats: CatalogStats;
}

export default function CatalogStatsCards({ stats }: Props) {
  const cards = [
    {
      icon: Box,
      label: "Total Products",
      value: stats.totalProducts.toString(),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: ChartColumnIncreasing,
      label: "Inventory Value",
      value: formatCompactCurrency(stats.inventoryValue),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Tag,
      label: "Avg. Price",
      value: formatCompactCurrency(Math.round(stats.avgPrice)),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: BadgeAlert,
      label: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      color: "text-amber-600",
      bg: "bg-amber-50",
      alert: stats.lowStockCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`text-lg ${card.bg} w-10 h-10 rounded-lg flex items-center justify-center`}
            >
              <card.icon size={20} className={card.color} />
            </div>
            <p className={`text-sm font-bold ${card.color}`}>{card.label}</p>
          </div>
          <p
            className={`text-2xl font-bold ${card.alert ? "text-amber-600" : "text-gray-800"}`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
