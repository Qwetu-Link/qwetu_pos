import {
  CheckCircle2,
  Package,
  PackageOpen,
  TriangleAlert,
} from "lucide-react";
import type { InventoryStatus } from "@/types/catalog";

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  low: {
    label: "Low Stock",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: Package,
  },
  critical: {
    label: "Critical",
    cls: "bg-red-50 text-red-700 border-red-200",
    Icon: TriangleAlert,
  },
  reorder: {
    label: "Reorder",
    cls: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: PackageOpen,
  },
};

export default function StatusBadge({
  status,
}: {
  status: InventoryStatus;
}) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}
