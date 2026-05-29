import type { InputHTMLAttributes } from "react";

export default function ExpenseField({
  label,
  type = "text",
  placeholder = "",
  required = false,
  error,
  ...inputProps
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        {...inputProps}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
