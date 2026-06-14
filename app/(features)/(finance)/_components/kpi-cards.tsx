'use client'

import React from 'react'
import { TrendingUp, Wallet, CreditCard, Banknote } from 'lucide-react'

export function KPICards() {
  const kpis = [
    {
      label: "Today's Revenue",
      value: 'KES 45,230',
      change: '+12.5%',
      icon: TrendingUp,
      iconBg: 'bg-[#42688C]/10 text-[#42688C]',
    },
    {
      label: 'Monthly Revenue',
      value: 'KES 1.2M',
      change: '+8.2%',
      icon: Banknote,
      iconBg: 'bg-[#42688C]/10 text-[#42688C]',
    },
    {
      label: 'Gross Profit',
      value: 'KES 450K',
      change: '+5.1%',
      icon: TrendingUp,
      iconBg: 'bg-[#42688C]/10 text-[#42688C]',
    },
    {
      label: 'Outstanding Receivables',
      value: 'KES 230K',
      change: '-3.2%',
      icon: CreditCard,
      iconBg: 'bg-red-500/10 text-red-600',
    },
    {
      label: 'Cash Balance',
      value: 'KES 580K',
      change: '+2.8%',
      icon: Wallet,
      iconBg: 'bg-[#42688C]/10 text-[#42688C]',
    },
    {
      label: 'M-Pesa Balance',
      value: 'KES 125K',
      change: '+15.3%',
      icon: Banknote,
      iconBg: 'bg-[#42688C]/10 text-[#42688C]',
    },
  ]

  return (
    /* LIGHT CONTAINER BACKGROUND */
    <div className="bg-[#ECFEFF] p-6 rounded-2xl grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        const isPositive = kpi.change.startsWith('+')
        
        return (
          /* LIGHT ICY TILE:
             Uses transparent white (white/60) with background blur and a delicate slate border 
             to look like a sheet of ice sitting over the light background canvas.
          */
          <div 
            key={idx} 
            className="relative overflow-hidden rounded-xl border border-[#42688C]/20 bg-white/60 backdrop-blur-md p-6 transition-all duration-300 hover:bg-white/80 hover:border-[#42688C]/40 hover:translate-y-[-2px] shadow-md shadow-[#050724]/5"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                {/* Labels flip to deep slate color */}
                <p className="text-xs font-bold uppercase tracking-wider text-[#42688C]">
                  {kpi.label}
                </p>
                
                <div className="mt-3 flex items-baseline gap-2.5">
                  {/* Primary text flipped to your Deep Space #050724 for crisp light-mode readability */}
                  <h3 className="text-2xl font-black text-[#050724] tracking-tight">
                    {kpi.value}
                  </h3>
                  
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isPositive 
                      ? 'bg-[#42688C]/10 text-[#42688C]' 
                      : 'bg-red-500/10 text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              </div>

              <div className={`rounded-xl p-3 backdrop-blur-sm ${kpi.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}