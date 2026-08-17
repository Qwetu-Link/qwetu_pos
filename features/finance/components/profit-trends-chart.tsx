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
    <div className="min-w-0 rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-4 shadow-sm sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-white">Sales and Costs</h3>
      <p className="mb-4 text-sm text-[#9CB4CA]">Simple view of money made and money spent.</p>

      <div className="h-56 min-w-0 sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -18, right: 4, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#42688C" />
            <XAxis dataKey="month" stroke="#9CB4CA" />
            <YAxis stroke="#9CB4CA" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0C0F1D',
                border: '1px solid #42688C',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#42688C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#1A2846" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#42688C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm">
        <p className="text-[#9CB4CA]">Average Monthly Profit: <span className="font-semibold text-white">KES 64K</span></p>
      </div>
    </div>
  )
}
