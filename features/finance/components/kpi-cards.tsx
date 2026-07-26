'use client'

import React from 'react'
import { Banknote, CreditCard, ReceiptText, ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import type { FinanceKpi } from '@/types/finance'

export function KPICards() {
  const kpis: FinanceKpi[] = [
    {
      label: "Today's POS Sales",
      value: 'KES 457,230',
      change: '+12.5%',
      icon: TrendingUp,
      iconBg: 'bg-[#42688C]/20 text-[#E2F4DF]',
    },
    {
      label: 'M-Pesa Collections',
      value: 'KES 214,800',
      change: '+8.2%',
      icon: CreditCard,
      iconBg: 'bg-[#42688C]/20 text-[#E2F4DF]',
    },
    {
      label: 'Cash Drawer Total',
      value: 'KES 138,450',
      change: '+2.8%',
      icon: Banknote,
      iconBg: 'bg-amber-400/15 text-amber-200',
    },
    {
      label: 'Profit After Costs',
      value: '38.4%',
      change: '+5.1%',
      icon: ReceiptText,
      iconBg: 'bg-[#42688C]/15 text-[#E2F4DF]',
    },
    {
      label: 'Customer Wallets',
      value: 'KES 92,600',
      change: '+4.6%',
      icon: Wallet,
      iconBg: 'bg-[#42688C]/20 text-[#E2F4DF]',
    },
    {
      label: 'Checked Today',
      value: '96.8%',
      change: '+1.7%',
      icon: ShieldCheck,
      iconBg: 'bg-[#1A2846] text-[#D3E3F0]',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        const isPositive = kpi.change.startsWith('+')

        return (
          <div
            key={idx}
            className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm transition hover:border-[#42688C]/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#9CB4CA]">
                  {kpi.label}
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {kpi.value}
                  </h3>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isPositive
                      ? 'bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30'
                      : 'bg-red-400/15 text-red-200 ring-1 ring-red-300/25'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              </div>

              <div className={`rounded-lg p-3 ${kpi.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
