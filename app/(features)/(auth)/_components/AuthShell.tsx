import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-8 lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(16,185,129,0.24),_transparent_30%),linear-gradient(145deg,_#020617_0%,_#0f172a_55%,_#064e3b_100%)]" />
          <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-sm font-black text-slate-950">
              QL
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Qwetu<span className="text-emerald-300">Links</span>
            </span>
          </Link>
          </div>
          <div className="relative flex flex-1 flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              Secure POS workspace
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-normal">
              Sign in to the workspace that connects your sales counter to your
              back office.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
              Cashiers record payments, stock teams control inventory,
              accountants reconcile money, and owners see the full store picture.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-emerald-950/40 backdrop-blur">
              <div className="rounded-xl bg-slate-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Today&apos;s Access Summary
                    </p>
                    <p className="text-xs text-slate-500">
                      Role based activity across the store
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                    <BarChart3 className="h-4 w-4" />
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Sales", "76", "bg-emerald-400"],
                    ["Payments", "96", "bg-blue-400"],
                    ["Stock alerts", "17", "bg-amber-400"],
                  ].map(([label, value, color]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <span className={`block h-1.5 w-8 rounded-full ${color}`} />
                      <p className="mt-3 text-xs text-slate-500">{label}</p>
                      <p className="mt-1 text-xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      icon: CreditCard,
                      title: "M-Pesa payment matched",
                      detail: "TXN-1001 confirmed by cashier desk",
                    },
                    {
                      icon: PackageCheck,
                      title: "Stock task assigned",
                      detail: "Accessories reorder requires approval",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Collection follow-up ready",
                      detail: "11 Lipa Mdogo customers due today",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Owner", "Cashier", "Accountant"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-slate-100"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
                QL
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Qwetu<span className="text-emerald-600">Links</span>
              </span>
            </Link>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div>
                <h1 className="text-3xl font-black tracking-normal text-slate-900">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>
              </div>
              <div className="mt-8">{children}</div>
              <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                {footer}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
