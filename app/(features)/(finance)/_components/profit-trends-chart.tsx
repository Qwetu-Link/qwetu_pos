'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function ProfitTrendsChart() {
  const data = [
    { month: 'Jan', revenue: 120, expenses: 80, profit: 40 },
    { month: 'Feb', revenue: 140, expenses: 85, profit: 55 },
    { month: 'Mar', revenue: 130, expenses: 78, profit: 52 },
    { month: 'Apr', revenue: 160, expenses: 95, profit: 65 },
    { month: 'May', revenue: 180, expenses: 100, profit: 80 },
    { month: 'Jun', revenue: 200, expenses: 110, profit: 90 },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Profit Trends</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm">
        <p className="text-muted-foreground">Average Monthly Profit: <span className="font-semibold text-foreground">KES 64K</span></p>
      </div>
    </div>
  )
}
