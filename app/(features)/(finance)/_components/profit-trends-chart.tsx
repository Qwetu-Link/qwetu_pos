'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ProfitTrendPoint } from '@/types/finance'

export function ProfitTrendsChart() {
  const data: ProfitTrendPoint[] = [
    { month: 'Jan', revenue: 120, expenses: 80, profit: 40 },
    { month: 'Feb', revenue: 140, expenses: 85, profit: 55 },
    { month: 'Mar', revenue: 130, expenses: 78, profit: 52 },
    { month: 'Apr', revenue: 160, expenses: 95, profit: 65 },
    { month: 'May', revenue: 180, expenses: 100, profit: 80 },
    { month: 'Jun', revenue: 200, expenses: 110, profit: 90 },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-slate-900">Sales and Costs</h3>
      <p className="mb-4 text-sm text-slate-500">Simple view of money made and money spent.</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#0f172a' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm">
        <p className="text-slate-500">Average Monthly Profit: <span className="font-semibold text-slate-900">KES 64K</span></p>
      </div>
    </div>
  )
}
