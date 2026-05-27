"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/config/roles";
import Sidebar from "./_sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userRole: UserRole = "Owner";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Shell */}
      <Sidebar
        currentTab={pathname}
        userRole={userRole}
      />

      {/* Main Fluid Render Space Container */}
      {/* Main content */}
      <div className="flex min-h-screen min-w-0 flex-col overflow-hidden pt-16 transition-[margin-left] duration-300 md:ml-[280px] md:pt-0">
        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
