import {
  CheckCircle2,
  TrendingUp,
  TriangleAlert,
  Truck,
} from "lucide-react";
import type { InventoryStatus } from "@/types/inventory";

interface Config {
  label: string;
  cls: string;
  Icon: React.ElementType;
}

const STATUS_MAP: Record<InventoryStatus, Config> = {
  healthy: {
    label: "Healthy",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  low: {
    label: "Low Stock",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: TrendingUp,
  },
  critical: {
    label: "Critical",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    Icon: TriangleAlert,
  },
  reorder: {
    label: "Reorder Now",
    cls: "bg-red-50 text-red-700 border-red-200",
    Icon: Truck,
  },
};

export function StatusBadge({ status }: { status: InventoryStatus }) {
  const { label, cls, Icon } = STATUS_MAP[status] ?? STATUS_MAP.healthy;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      <Icon size={11} />
      {label}
    </span>
  );
}
