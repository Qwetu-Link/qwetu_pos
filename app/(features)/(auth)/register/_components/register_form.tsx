import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

export default function RegisterForm() {
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
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-[560px] overflow-y-auto rounded-[1.2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 transition lg:-ml-5 lg:-translate-x-10">
            <Link
              href="/"
              className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
              aria-label="Back to overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="mb-4 text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-slate-950 lg:hidden">
                Q<span className="text-emerald-600">L</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Account
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Register your business workspace
              </p>
            </div>

            <form className="space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                    Business
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Qwetu Links"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-400" />
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Mary Wanjiku"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="owner@qwetulinks.co.ke"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    Phone
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-emerald-400" />
                  Password
                </span>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </form>

            <p className="mt-4 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-700">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
