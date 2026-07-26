import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconCls: string;
};

export default function StatCard({ icon: Icon, label, value, iconCls }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex items-center gap-2 ${iconCls}`}>
        <Icon size={16} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}