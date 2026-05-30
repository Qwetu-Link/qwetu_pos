import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { ExpenseStatus } from "@/types/transactions";

export default function ExpenseStatusBadge({
  status,
}: {
  status: ExpenseStatus;
}) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
  } as const;
  const icons = {
    approved: CheckCircle2,
    pending: Clock3,
    rejected: XCircle,
  } as const;
  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
