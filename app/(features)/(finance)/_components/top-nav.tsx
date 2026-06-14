"use client";

import React from "react";
import { Menu, Search, Bell, Settings } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="w-full border-b border-slate-100 bg-white flex-shrink-0">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Box */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 group focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-48 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50/80 transition-colors group">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shadow-sm transition-transform group-hover:scale-105">
                JD
              </div>
              <span className="hidden sm:inline text-sm font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                John Doe
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
