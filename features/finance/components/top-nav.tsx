"use client";

import React from "react";
import { Menu, Search, Bell, Settings } from "lucide-react";
import type { FinanceTopNavProps } from "@/types/finance";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function TopNav({ onMenuClick }: FinanceTopNavProps) {
  return (
    <header className="w-full flex-shrink-0 border-b border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle finance navigation"
            className="rounded-lg p-2 text-[#D3E3F0] transition-colors hover:bg-[#1A2846] hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="group hidden items-center gap-2 rounded-xl border border-[#42688C]/30 bg-[#13203A] px-3 py-2 transition-all focus-within:border-[#42688C] focus-within:bg-[#0C0F1D] focus-within:ring-2 focus-within:ring-[#42688C]/30 md:flex">
            <Search className="h-4 w-4 text-[#7F9AB5] transition-colors group-focus-within:text-[#E2F4DF]" />
            <input
              type="text"
              placeholder="Search POS finance..."
              className="w-56 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#7F9AB5]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button className="relative rounded-lg p-2 text-[#B8CBE0] transition-colors hover:bg-[#1A2846] hover:text-white" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E2F4DF] ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 border-l border-[#42688C]/20 pl-4">
            <button className="rounded-lg p-2 text-[#9CB4CA] transition-colors hover:bg-[#1A2846] hover:text-white" aria-label="Financial management settings">
              <Settings className="h-5 w-5" />
            </button>

            <button className="group flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[#1A2846]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#42688C]/40 bg-[#42688C]/20 text-xs font-bold text-[#E2F4DF] shadow-sm transition-transform group-hover:scale-105">
                JD
              </div>
              <span className="hidden text-sm font-bold text-[#E2F4DF] transition-colors group-hover:text-white sm:inline">
                John Doe
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
