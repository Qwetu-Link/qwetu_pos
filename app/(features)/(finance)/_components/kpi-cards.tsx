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
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Monthly Revenue',
      value: 'KES 1.2M',
      change: '+8.2%',
      icon: Banknote,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Gross Profit',
      value: 'KES 450K',
      change: '+5.1%',
      icon: TrendingUp,
      color: 'bg-secondary/10 text-secondary-foreground',
    },
    {
      label: 'Outstanding Receivables',
      value: 'KES 230K',
      change: '-3.2%',
      icon: CreditCard,
      color: 'bg-destructive/10 text-destructive',
    },
    {
      label: 'Cash Balance',
      value: 'KES 580K',
      change: '+2.8%',
      icon: Wallet,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'M-Pesa Balance',
      value: 'KES 125K',
      change: '+15.3%',
      icon: Banknote,
      color: 'bg-accent/10 text-accent',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <div key={idx} className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                  <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`rounded-lg p-3 ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
