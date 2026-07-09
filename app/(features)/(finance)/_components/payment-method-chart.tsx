'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PaymentMixSlice } from '@/types/finance'

export function PaymentMethodChart() {
  const data: PaymentMixSlice[] = [
    { name: 'M-Pesa', value: 45, color: '#E2F4DF' },
    { name: 'Cash', value: 30, color: '#42688C' },
    { name: 'Bank', value: 18, color: '#9CB4CA' },
    { name: 'Wallet', value: 7, color: '#1A2846' },
  ]

  return (
    <div className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-white">POS Payment Mix</h3>
      <p className="mb-4 text-sm text-[#9CB4CA]">Sales collections by checkout method.</p>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0C0F1D',
              border: '1px solid #42688C',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-white">{item.name}</span>
            </div>
            <span className="font-medium text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
