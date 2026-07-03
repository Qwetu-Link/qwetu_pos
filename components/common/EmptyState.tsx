import type { ComponentType, ReactNode } from "react";
import { SearchX } from "lucide-react";

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={joinClasses(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-center shadow-sm",
        compact ? "min-h-40 px-4 py-8" : "min-h-64 px-6 py-14",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" strokeWidth={1.7} />
      </div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

