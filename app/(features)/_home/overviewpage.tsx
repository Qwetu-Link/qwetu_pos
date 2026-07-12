import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const modules = [
  {
    title: "Sell",
    detail: "Create orders, print receipts, and record payments quickly.",
    icon: ReceiptText,
  },
  {
    title: "Stock",
    detail: "Track products, variants, and low inventory before it runs out.",
    icon: Boxes,
  },
  {
    title: "Collect",
    detail: "Follow Lipa Mdogo balances, installments, and customer payments.",
    icon: WalletCards,
  },
  {
    title: "Report",
    detail: "Review sales, customers, inventory, and daily performance.",
    icon: BarChart3,
  },
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
              Q
            </span>
            <span>
              <span className="block text-sm font-semibold leading-5 text-slate-950">
                Qwetu POS
              </span>
              <span className="block text-xs text-slate-500">
                Store operations made simple
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Login
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 items-center py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <ShieldCheck className="size-4" />
              Retail ready
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Simple POS for sales, stock, and collections.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Qwetu keeps daily shop work clear: serve customers, manage stock,
              follow payments, and see the numbers that matter without a heavy
              dashboard in the way.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Open workspace
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-950">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {module.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
