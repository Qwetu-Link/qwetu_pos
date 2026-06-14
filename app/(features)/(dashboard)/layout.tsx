"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/config/roles";
import Sidebar from "./_sidebar/sidebar";
import { Analytics } from '@vercel/analytics/next'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userRole: UserRole = "Owner";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        currentTab={pathname}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
        userRole={userRole}
      />

      <div
        className={`flex min-h-screen min-w-0 flex-col overflow-hidden pt-16 transition-[margin-left] duration-300 md:pt-0 ${
          isSidebarCollapsed ? "md:ml-[88px]" : "md:ml-[280px]"
        }`}
      >
        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </main>
      </div>
    </div>
  );
}
