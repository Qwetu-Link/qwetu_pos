import type { LucideIcon } from "lucide-react";

export default function InfoRow({
  label,
  value,
  valueClassName = "text-slate-900",
  icon: Icon,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex justify-between">
      <span className="flex items-center gap-1.5 text-slate-500">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}
