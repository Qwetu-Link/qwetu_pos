'use client'

import React, { useState } from 'react'
import { TopNav } from '@/features/finance/components/top-nav'
import { Sidebar } from '@/features/finance/components/sidebar'

export default function FinDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  )

  return (
    <div className="finance-theme flex min-h-dvh w-full overflow-x-hidden bg-[#13203A] text-white">

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-hidden transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-[280px]" : "md:pl-[88px]"
        }`}
      >
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#13203A] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
