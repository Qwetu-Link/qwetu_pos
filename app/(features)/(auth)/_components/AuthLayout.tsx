import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
  cardClassName = "max-w-[420px]",
}: {
  children: React.ReactNode;
  cardClassName?: string;
}) {
  return (
    <main className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="flex h-screen w-full items-center justify-center lg:flex-row">
        <section className="relative z-10 hidden flex-1 items-center justify-end overflow-visible pr-0 lg:flex lg:-mr-5">
          <div className="flex w-full flex-col items-center justify-center p-6">
            <div className="flex h-64 w-64 items-center justify-center rounded-[2rem] border border-emerald-100 bg-white shadow-2xl shadow-emerald-100">
              <div className="flex h-44 w-44 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-6xl font-black tracking-tight text-slate-950 shadow-inner">
                Q<span className="text-emerald-600">L</span>
              </div>
            </div>
            <p className="mt-5 text-center text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Qwetu Links POS
            </p>
          </div>
        </section>

        <section className="relative z-20 flex h-full flex-1 items-center justify-center p-4 lg:justify-start lg:pl-0">
          <div
            className={`max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-[1.2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 transition lg:-ml-5 lg:-translate-x-10 ${cardClassName}`}
          >
            <Link
              href="/"
              className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
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
