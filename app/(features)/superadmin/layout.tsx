"use client";

import type { ReactNode } from "react";
import SuperAdminSidebar from "@/features/superadmin/components/SuperAdminSidebar";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50/60 text-slate-950">
      <SuperAdminSidebar />
      <div className="min-h-screen md:ml-[292px]">
        <main className="min-h-screen px-3 pb-8 pt-28 sm:px-5 md:pt-5 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
