"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  LogOut,
  RotateCcw,
  Coins,
  CreditCard,
  Wallet,
  BarChart2,
  PieChartIcon,
  Building2,
} from "lucide-react";
import type { FinanceNavItem, FinanceSidebarProps } from "@/types/finance";

export function Sidebar({ open }: FinanceSidebarProps) {
  const pathname = usePathname();

  const menuItems: FinanceNavItem[] = [
    {
      section: "dashboard",
      label: "Overview",
      icon: BarChart3,
      href: "/finance-erp",
    },
    {
      section: "revenue",
      label: "Sales Money",
      icon: TrendingUp,
      href: "/finance-erp/sales",
    },
    {
      section: "customer-wallet",
      label: "Customers Wallet",
      icon: Wallet,
      href: "/finance-erp/customer-wallets",
    },
    {
      section: "salary-payroll",
      label: "Payroll",
      icon: Coins,
      href: "/finance-erp/payroll",
    },
    {
      section: "payments",
      label: "Payments",
      icon: CreditCard,
      href: "/finance-erp/payments",
    },
    {
      section: "expense",
      label: "Expenses",
      icon: Briefcase,
      href: "/finance-erp/expense",
    },
    {
      section: "refunds",
      label: "Refunds",
      icon: RotateCcw,
      href: "/finance-erp/refunds",
    },
    {
      section: "budgeting",
      label: "Budgets",
      icon: BarChart2,
      href: "/finance-erp/budgeting",
    },
    {
      section: "reports",
      label: "Reports",
      icon: PieChartIcon,
      href: "/finance-erp/reports",
    },
    {
      section: "entity",
      label: "Branches",
      icon: Building2,
      href: "/finance-erp/entity",
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0C0F1D] border-r border-[#42688C]/20 flex flex-col justify-between shadow-xl shadow-[#050724]/30 transition-[width] duration-300 ease-in-out hidden md:flex ${
        open ? "w-[280px]" : "w-[88px]"
      }`}
    >
      {/* Branding and Navigation Container */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo Area matches your premium branding setup */}
        <div className="p-4 border-b border-[#42688C]/20 flex items-center gap-3 h-[77px] flex-shrink-0">
          <div className="w-11 h-11 flex-shrink-0 bg-[#42688C]/20 rounded-xl flex items-center justify-center text-[#E2F4DF] font-bold text-sm">
            QL
          </div>
          {open && (
            <div className="min-w-0 transition-opacity duration-200">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Qwetu<span className="text-[#E2F4DF]">Links</span>
              </h1>
              <p className="text-sm font-medium text-[#9CB4CA]">
                Financial Management
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links Area with specialized scrolling logic */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              pathname === menu.href || pathname.startsWith(menu.href + "/");

            return (
              <Link key={menu.section} href={menu.href} passHref>
                <button
                  title={!open ? menu.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all group duration-200 ${
                    !open ? "justify-center px-0 py-2.5" : "px-4 py-2"
                  } ${
                    isActive
                      ? "bg-[#42688C]/20 text-[#E2F4DF] font-bold"
                      : "text-[#D3E3F0] hover:bg-[#13203A] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? "text-[#E2F4DF]"
                        : "text-[#9CB4CA] group-hover:text-[#E2F4DF]"
                    }`}
                  />
                  {open && (
                    <span className="flex-1 text-left truncate transition-opacity duration-200">
                      {menu.label}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Workspace Profile Footer */}
      <div className="p-4 border-t border-[#42688C]/20 bg-[#1A2846]/50 flex-shrink-0">
        <button
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-bold transition-colors py-2 text-[#9CB4CA] hover:text-red-200 hover:bg-red-400/15 ${
            !open ? "justify-center px-0" : "px-4"
          }`}
          title="Logout Profile"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {open && (
            <span className="flex-1 text-left transition-opacity duration-200">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
