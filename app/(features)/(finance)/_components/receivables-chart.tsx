'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ReceivablesChart() {
  const data = [
    { aging: 'Current', amount: 150 },
    { aging: '30 Days', amount: 85 },
    { aging: '60 Days', amount: 45 },
    { aging: '90 Days', amount: 28 },
    { aging: '120+ Days', amount: 12 },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Receivables Aging Analysis</h3>
          <p className="text-sm text-muted-foreground">Outstanding invoices by aging period</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Outstanding</p>
          <p className="text-2xl font-bold text-foreground">KES 320K</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="aging" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
            formatter={(value) => `KES ${value}K`}
          />
          <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Collection Rate</p>
          <p className="text-2xl font-bold text-accent">87%</p>
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Days Sales Outstanding</p>
          <p className="text-2xl font-bold text-foreground">32</p>
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Overdue Accounts</p>
          <p className="text-2xl font-bold text-destructive">42</p>
        </div>
      </div>
    </div>
  )
}
