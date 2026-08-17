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
    <div className="min-w-0 rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">Sales This Week</h3>
          <p className="text-sm text-[#9CB4CA]">Daily sales compared with the target</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <button className="rounded px-3 py-1 text-sm font-medium text-white hover:bg-[#1A2846]">Day</button>
          <button className="rounded bg-[#42688C] px-3 py-1 text-sm font-medium text-white">Week</button>
          <button className="rounded px-3 py-1 text-sm font-medium text-white hover:bg-[#1A2846]">Month</button>
        </div>
      </div>

      <div className="h-64 min-w-0 sm:h-72 lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
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
      </div>

      <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
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
