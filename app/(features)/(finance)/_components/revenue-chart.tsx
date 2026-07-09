'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RevenueTrendPoint } from '@/types/finance'

export function RevenueChart() {
  const data: RevenueTrendPoint[] = [
    { day: 'Mon', revenue: 45000, target: 50000 },
    { day: 'Tue', revenue: 52000, target: 50000 },
    { day: 'Wed', revenue: 48000, target: 50000 },
    { day: 'Thu', revenue: 61000, target: 50000 },
    { day: 'Fri', revenue: 55000, target: 50000 },
    { day: 'Sat', revenue: 67000, target: 50000 },
    { day: 'Sun', revenue: 72000, target: 50000 },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Sales This Week</h3>
          <p className="text-sm text-slate-500">Daily sales compared with the target</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded px-3 py-1 text-sm font-medium text-slate-900 hover:bg-slate-100">Day</button>
          <button className="rounded px-3 py-1 text-sm font-medium bg-emerald-600 text-white">Week</button>
          <button className="rounded px-3 py-1 text-sm font-medium text-slate-900 hover:bg-slate-100">Month</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#0f172a' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
          <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-6 text-sm">
        <div>
          <span className="text-slate-500">Average Daily Revenue:</span>
          <p className="text-lg font-semibold text-slate-900">KES 57,000</p>
        </div>
        <div>
          <span className="text-slate-500">Weekly Total:</span>
          <p className="text-lg font-semibold text-emerald-600">KES 400,000</p>
        </div>
      </div>
    </div>
  )
}
