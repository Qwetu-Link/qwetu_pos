import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type HeaderAction = {
  label: string;
  value?: string;
};

export function SuperAdminPageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>;
}

export function SuperAdminHeader({
  eyebrow = "Super Admin",
  title,
  description,
  icon: Icon,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: HeaderAction[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
          {eyebrow}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-5 p-5 sm:p-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
        {actions?.length ? (
          <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:min-w-64">
            {actions.map((action) => (
              <div
                key={action.label}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {action.label}
                </p>
                {action.value ? (
                  <p className="mt-1 text-sm font-bold text-slate-900">{action.value}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SuperAdminPanel({
  title,
  description,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SuperAdminMetricCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

export function SuperAdminStatusPill({
  tone = "emerald",
  children,
}: {
  tone?: "emerald" | "amber" | "slate" | "red" | "blue";
  children: ReactNode;
}) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${classes[tone]}`}>
      {children}
    </span>
  );
}
