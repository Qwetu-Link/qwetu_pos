"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Building2,
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
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[280px] flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-sm md:flex">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
          SA
        </div>
        <div>
          <p className="text-lg font-black tracking-tight text-slate-900">Super Admin</p>
          <p className="text-sm text-slate-500">Platform console</p>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Global access</p>
              <p className="text-xs text-slate-500">Manage all tenants</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
