import type { LucideIcon } from "lucide-react";

export default function ProfileTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-emerald-600" />
        <span>{label}</span>
      </div>
      <p className="break-words font-semibold text-slate-800">{value}</p>
    </div>
  );
}
