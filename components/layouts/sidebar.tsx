"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  X,
} from "lucide-react";
import { ROLE_PERMISSIONS, UserRole } from "@/utils/roles";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { ALL_NAV_ITEMS } from "./sidebar.config";

interface SidebarProps {
  currentTab: string;
  isCollapsed: boolean;
  onCollapseChange: (isCollapsed: boolean) => void;
  onTabChange?: (tab: string) => void;
  userRole: UserRole;
}

export default function Sidebar({
  currentTab,
  isCollapsed,
  onCollapseChange,
  onTabChange,
  userRole,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const pathname = usePathname();

  // Filter navigation items based on the user's role permissions
  const allowedTabs = ROLE_PERMISSIONS[userRole] || [];
  const filteredNavItems = ALL_NAV_ITEMS.filter((item) =>
    allowedTabs.includes(item.tab),
  );

  const handleNavClick = (href: string) => {
    onTabChange?.(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setStatusMessage("Demo logout hook ready. Connect this to your auth flow.");
    window.setTimeout(() => setStatusMessage(""), 3200);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-emerald-600 tracking-tight text-lg">
            QwetuLinks
          </span>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
            {userRole} Profile
          </span>
        </div>
        <div className="w-10"></div> {/* Spacer balance */}
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col justify-between shadow-xl shadow-slate-900/5 transition-[transform,width] duration-300 ease-in-out md:translate-x-0 ${
          isCollapsed ? "md:w-[88px]" : "md:w-[280px]"
        } w-[280px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Branding Area */}
        <div>
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-11 h-11 relative bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-sm">
              QW
            </div>
            <div className={`min-w-0 ${isCollapsed ? "md:hidden" : ""}`}>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Qwetu<span className="text-emerald-600">Links</span>
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Enterprise System
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCollapseChange(!isCollapsed)}
              className="ml-auto hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Links Area */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            {filteredNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                currentTab === item.href;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl text-md font-medium transition-all group duration-200 ${
                    isCollapsed ? "md:justify-center md:px-0 md:py-2.5" : "px-4 py-1.5"
                  } ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-black font-bold hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <DynamicIcon
                    name={item.icon}
                    className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                      isActive
                        ? "text-emerald-600"
                        : "text-black group-hover:text-slate-600"
                    }`}
                  />
                  <span className={isCollapsed ? "md:hidden" : ""}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Workspace Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {statusMessage ? (
            <div className="mb-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {statusMessage}
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
            </div>
            <div className={`flex-1 min-w-0 ${isCollapsed ? "md:hidden" : ""}`}>
              <p className="text-sm font-bold text-slate-800 truncate">
                Store Management
              </p>
              <p className="text-xs text-slate-500 font-medium truncate">
                {userRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout Profile"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
