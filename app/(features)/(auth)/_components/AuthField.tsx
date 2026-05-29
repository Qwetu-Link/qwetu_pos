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
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-400" />
        {label}
      </span>
      <span className="relative block">
        <input
          {...inputProps}
          className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${rightElement ? "pr-12" : ""} ${className}`}
        />
        {rightElement}
      </span>
    </label>
  );
}
