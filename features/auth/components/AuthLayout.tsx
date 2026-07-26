import Link from "next/link";
import { ArrowLeft, BadgeCheck, BarChart3, Boxes, CreditCard, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
  cardClassName = "max-w-[420px]",
}: {
  children: React.ReactNode;
  cardClassName?: string;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4f1] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
        <section className="hidden min-h-screen items-center bg-slate-950 px-8 py-10 text-white lg:flex">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to overview
            </Link>

            <div>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-slate-950 shadow-xl shadow-emerald-950/30">
                QL
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">
                Qwetu Links POS
              </p>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                Sign in to continue managing store operations with secure role-based access across your POS modules.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureTile icon={Boxes} label="Inventory control" value="Live catalog" />
              <FeatureTile icon={CreditCard} label="Sales payments" value="M-Pesa ready" />
              <FeatureTile icon={BarChart3} label="Finance view" value="Daily insights" />
              <FeatureTile icon={ShieldCheck} label="Access roles" value="Protected" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Workspace status</p>
                  <p className="text-sm text-slate-400">Authentication and tenant access are online.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div
            className={`max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/60 transition sm:p-7 ${cardClassName}`}
          >
            <Link
              href="/"
              className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 lg:hidden"
              aria-label="Back to overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="text-xs text-slate-400">{value}</p>
        </div>
      </div>
    </div>
  );
}
