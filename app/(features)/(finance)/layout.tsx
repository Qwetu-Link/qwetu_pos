'use client'

import React, { useState } from 'react'
import { TopNav } from './_components/top-nav'
import { Sidebar } from './_components/sidebar'

export default function FinDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-screen bg-white text-slate-900 overflow-hidden">
    
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div 
        className={`flex flex-col flex-1 min-w-0 h-full overflow-hidden transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-[280px]" : "md:pl-[88px]"
        }`}
      >
        {/* Top Navigation Bar - Now resizes with liquid smoothness */}
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}