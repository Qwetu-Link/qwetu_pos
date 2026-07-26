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
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black text-white">
              SA
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">Qwetu Platform</p>
              <p className="text-xs text-slate-500">Superadmin console</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
              <Menu className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
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
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[292px] flex-col border-r border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-lime-50 px-4 py-5 text-slate-950 shadow-xl md:flex">
        <Link href="/superadmin" className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-3 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
            SA
          </div>
          <div>
            <p className="text-base font-black tracking-tight">Qwetu Platform</p>
            <p className="text-xs font-medium text-emerald-700">Superadmin command</p>
          </div>
        </Link>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800">
            <Sparkles className="h-4 w-4" />
            Global mode
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            You are managing all tenant workspaces, subscriptions, and access controls.
          </p>
        </div>

        <nav className="mt-5 space-y-1.5">
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
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  active ? "bg-white text-emerald-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Privileged access</p>
                <p className="text-xs text-slate-500">Audit trail enabled</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CircleDollarSign className="h-4 w-4 text-emerald-700" />
                Billing health
              </div>
              <p className="mt-1 text-sm font-black text-slate-950">98% collected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
