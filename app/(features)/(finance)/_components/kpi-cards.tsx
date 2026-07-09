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
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'M-Pesa Collections',
      value: 'KES 214,800',
      change: '+8.2%',
      icon: CreditCard,
      iconBg: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Cash Drawer Total',
      value: 'KES 138,450',
      change: '+2.8%',
      icon: Banknote,
      iconBg: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Profit After Costs',
      value: '38.4%',
      change: '+5.1%',
      icon: ReceiptText,
      iconBg: 'bg-violet-50 text-violet-700',
    },
    {
      label: 'Customer Wallets',
      value: 'KES 92,600',
      change: '+4.6%',
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Checked Today',
      value: '96.8%',
      change: '+1.7%',
      icon: ShieldCheck,
      iconBg: 'bg-slate-100 text-slate-700',
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
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500">
                  {kpi.label}
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {kpi.value}
                  </h3>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-red-50 text-red-700 ring-1 ring-red-100'
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
