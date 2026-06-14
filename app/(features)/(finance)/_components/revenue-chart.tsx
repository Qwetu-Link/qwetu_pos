'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function RevenueChart() {
  const data = [
    { day: 'Mon', revenue: 45000, target: 50000 },
    { day: 'Tue', revenue: 52000, target: 50000 },
    { day: 'Wed', revenue: 48000, target: 50000 },
    { day: 'Thu', revenue: 61000, target: 50000 },
    { day: 'Fri', revenue: 55000, target: 50000 },
    { day: 'Sat', revenue: 67000, target: 50000 },
    { day: 'Sun', revenue: 72000, target: 50000 },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
          <p className="text-sm text-muted-foreground">Weekly revenue performance</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded px-3 py-1 text-sm font-medium text-foreground hover:bg-secondary">Day</button>
          <button className="rounded px-3 py-1 text-sm font-medium bg-primary text-primary-foreground">Week</button>
          <button className="rounded px-3 py-1 text-sm font-medium text-foreground hover:bg-secondary">Month</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: 'var(--color-primary)' }} />
          <Line type="monotone" dataKey="target" stroke="var(--color-muted)" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Average Daily Revenue:</span>
          <p className="text-lg font-semibold text-foreground">KES 57,000</p>
        </div>
        <div>
          <span className="text-muted-foreground">Weekly Total:</span>
          <p className="text-lg font-semibold text-accent">KES 400,000</p>
        </div>
      </div>
    </div>
  )
}
