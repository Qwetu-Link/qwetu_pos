"use client";

import type { ReactNode } from "react";
import SuperAdminSidebar from "./_components/SuperAdminSidebar";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <SuperAdminSidebar />
      <div className="min-h-screen md:ml-[280px]">
        <main className="min-h-screen px-4 pb-8 pt-24 sm:px-6 md:pt-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
