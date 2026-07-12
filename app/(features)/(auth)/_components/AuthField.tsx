import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
  label: string;
  rightElement?: ReactNode;
};

export default function AuthField({
  icon: Icon,
  label,
  rightElement,
  className = "",
  ...inputProps
}: AuthFieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      <span className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </span>
      <span className="relative block">
        <input
          {...inputProps}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${rightElement ? "pr-12" : ""} ${className}`}
        />
        {rightElement}
      </span>
    </label>
  );
}
