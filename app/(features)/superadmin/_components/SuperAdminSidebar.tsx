"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Building2,
  CircleDollarSign,
  Layers3,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";

const items = [
  { href: "/superadmin", label: "Overview", icon: BarChart3 },
  { href: "/superadmin/business", label: "Businesses", icon: Building2 },
  { href: "/superadmin/subscriptions", label: "Subscriptions", icon: Layers3 },
  { href: "/superadmin/reports", label: "Reports", icon: BarChart3 },
  { href: "/superadmin/settings", label: "Settings", icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/superadmin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
              SA
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">Super Admin</p>
              <p className="text-xs text-slate-500">Platform console</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/superadmin" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[280px] flex-col border-r border-slate-200 bg-slate-950 px-4 py-6 text-white shadow-xl md:flex">
        <Link href="/superadmin" className="flex items-center gap-3 px-2 pb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-slate-950">
            SA
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">Super Admin</p>
            <p className="text-sm text-slate-400">Platform console</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/superadmin" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Global access</p>
                <p className="text-xs text-slate-400">Manage all tenants</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                Billing health
              </div>
              <p className="mt-1 text-sm font-black text-white">98% collected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
