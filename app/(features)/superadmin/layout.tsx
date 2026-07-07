"use client";

import type { ReactNode } from "react";
import SuperAdminSidebar from "./_components/SuperAdminSidebar";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SuperAdminSidebar />
      <div className="min-h-screen md:ml-[280px]">
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
