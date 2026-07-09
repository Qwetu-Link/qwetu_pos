"use client";

import React from "react";
import { Menu, Search, Bell, Settings } from "lucide-react";
import type { FinanceTopNavProps } from "@/types/finance";

export function TopNav({ onMenuClick }: FinanceTopNavProps) {
  return (
    <header className="w-full flex-shrink-0 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle finance navigation"
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="group hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 md:flex">
            <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
            <input
              type="text"
              placeholder="Search POS finance..."
              className="w-56 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
            <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Financial management settings">
              <Settings className="h-5 w-5" />
            </button>

            <button className="group flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-700 shadow-sm transition-transform group-hover:scale-105">
                JD
              </div>
              <span className="hidden text-sm font-bold text-slate-800 transition-colors group-hover:text-slate-950 sm:inline">
                John Doe
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
