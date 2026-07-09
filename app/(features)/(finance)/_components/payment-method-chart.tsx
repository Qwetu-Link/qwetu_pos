'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PaymentMixSlice } from '@/types/finance'

export function PaymentMethodChart() {
  const data: PaymentMixSlice[] = [
    { name: 'M-Pesa', value: 45, color: '#059669' },
    { name: 'Cash', value: 30, color: '#10b981' },
    { name: 'Bank', value: 18, color: '#94a3b8' },
    { name: 'Wallet', value: 7, color: '#e2e8f0' },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-slate-900">POS Payment Mix</h3>
      <p className="mb-4 text-sm text-slate-500">Sales collections by checkout method.</p>

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
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#0f172a' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-slate-900">{item.name}</span>
            </div>
            <span className="font-medium text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
