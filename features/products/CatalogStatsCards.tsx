"use client";

import { formatCompactCurrency } from "@/utils/catalog-utils";
import { CatalogStats } from "@/types/admin/catalog";
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
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg sm:h-10 sm:w-10 ${card.bg}`}
            >
              <card.icon size={18} className={card.color} />
            </div>
            <p className={`text-xs font-bold sm:text-sm ${card.color}`}>{card.label}</p>
          </div>
          <p
            className={`text-xl font-bold sm:text-2xl ${card.alert ? "text-amber-600" : "text-gray-800"}`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
