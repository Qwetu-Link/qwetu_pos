import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  Store,
  Users,
  WalletCards,
} from "lucide-react";

const modules = [
  {
    title: "Sales Pipeline",
    detail: "Track orders, receipts, payments, and customer balances.",
    icon: ReceiptText,
  },
  {
    title: "Inventory Control",
    detail: "Manage products, variants, low stock, and reorder movement.",
    icon: Boxes,
  },
  {
    title: "Lipa Mdogo",
    detail: "Monitor installments, collections, arrears, and risk signals.",
    icon: WalletCards,
  },
  {
    title: "Reports Center",
    detail: "Generate finance, sales, customer, and stock reports.",
    icon: BarChart3,
  },
];

const highlights = [
  "Sell products and record payments from the same flow",
  "Track customer balances and Lipa Mdogo installments",
  "Know what stock is low before the counter runs out",
  "Give owners, managers, cashiers, and accountants the right dashboard",
];

const workflows = [
  {
    title: "Sell",
    detail: "Create orders, capture customer details, and receive cash, M-Pesa, card, or bank payments.",
    icon: ReceiptText,
  },
  {
    title: "Control Stock",
    detail: "Monitor products, variants, quantities, reorder alerts, and inventory movement.",
    icon: Boxes,
  },
  {
    title: "Collect",
    detail: "Follow expected installments, overdue plans, customer ledgers, and collection performance.",
    icon: WalletCards,
  },
  {
    title: "Report",
    detail: "Export sales, finance, customer, inventory, and collection reports for decision making.",
    icon: ClipboardList,
  },
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#ecfdf5_52%,_#ffffff_100%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_540px] lg:px-8">
          <div className="flex flex-col justify-center">
            <nav className="mb-16 flex items-center justify-between lg:mb-20">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
                  QL
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  Qwetu<span className="text-emerald-600">Links</span>
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Register
                </Link>
              </div>
            </nav>

            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              POS, inventory, customers, and installments for retail teams
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-normal text-slate-950 sm:text-6xl">
              A clearer way to run your electronics shop every day.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              QwetuLinks brings the counter, store room, customer ledger, and
              Lipa Mdogo collection desk into one POS system, so your team can
              sell faster and your business can see what is happening.
            </p>
            <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["For owners", "Revenue and reports"],
                ["For cashiers", "Orders and payments"],
                ["For stock teams", "Inventory movement"],
              ].map(([label, detail]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <p className="text-sm font-bold text-slate-900">{label}</p>
                  <p className="mt-1 text-xs text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Open Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex items-center pb-8 lg:pb-0">
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-emerald-100">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Store Command Center
                    </p>
                    <p className="text-xs text-slate-500">
                      Sales, stock, and collections in one view
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Revenue", "KES 286K", "bg-emerald-400"],
                    ["Orders", "76", "bg-blue-400"],
                    ["Collections", "KES 98K", "bg-amber-400"],
                    ["Customers", "306", "bg-violet-400"],
                  ].map(([label, value, color]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <span className={`block h-1.5 w-10 rounded-full ${color}`} />
                      <p className="mt-4 text-sm text-slate-500">{label}</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Collection Trend
                    </p>
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex h-32 items-end gap-3">
                    {[48, 62, 54, 78, 70, 88].map((height, index) => (
                      <div
                        key={height}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div className="flex h-24 w-full items-end rounded-full bg-slate-100">
                          <span
                            className="block w-full rounded-full bg-emerald-500"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Store className="h-4 w-4 text-blue-600" />
                      Active counter
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      14 orders are open, 8 are paid, and 3 need fulfillment.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Users className="h-4 w-4 text-violet-600" />
                      Customer ledger
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      11 installment plans are due for follow-up today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                How it helps
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-normal">
                One operating flow from sale to report.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Instead of switching between notebooks, spreadsheets, payment
                messages, and stock counts, your team works from a shared system
                that keeps each transaction connected.
              </p>
              <div className="mt-6 space-y-3">
                {highlights.map((highlight) => (
                  <p
                    key={highlight}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {highlight}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workflows.map((module) => {
                const Icon = module.icon;

                return (
                  <article
                    key={module.title}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-bold text-slate-900">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {module.detail}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <article
                  key={module.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {module.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
