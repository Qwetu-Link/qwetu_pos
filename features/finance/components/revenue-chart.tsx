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
    <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Sales This Week</h3>
          <p className="text-sm text-[#9CB4CA]">Daily sales compared with the target</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded px-3 py-1 text-sm font-medium text-white hover:bg-[#1A2846]">Day</button>
          <button className="rounded px-3 py-1 text-sm font-medium bg-[#42688C] text-white">Week</button>
          <button className="rounded px-3 py-1 text-sm font-medium text-white hover:bg-[#1A2846]">Month</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#42688C" />
          <XAxis dataKey="day" stroke="#9CB4CA" />
          <YAxis stroke="#9CB4CA" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0C0F1D',
              border: '1px solid #42688C',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#E2F4DF" strokeWidth={2} dot={{ fill: '#E2F4DF' }} />
          <Line type="monotone" dataKey="target" stroke="#42688C" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-6 text-sm">
        <div>
          <span className="text-[#9CB4CA]">Average Daily Revenue:</span>
          <p className="text-lg font-semibold text-white">KES 57,000</p>
        </div>
        <div>
          <span className="text-[#9CB4CA]">Weekly Total:</span>
          <p className="text-lg font-semibold text-[#E2F4DF]">KES 400,000</p>
        </div>
      </div>
    </div>
  )
}
