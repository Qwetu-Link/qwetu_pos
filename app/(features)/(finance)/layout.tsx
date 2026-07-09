'use client'

import React, { useState } from 'react'
import { TopNav } from './_components/top-nav'
import { Sidebar } from './_components/sidebar'

export default function FinDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`flex flex-col flex-1 min-w-0 h-full overflow-hidden transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-[280px]" : "md:pl-[88px]"
        }`}
      >
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
