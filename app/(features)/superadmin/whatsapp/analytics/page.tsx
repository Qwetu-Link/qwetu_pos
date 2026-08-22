'use client';

import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KPICard } from '@/components/kpi-card';
import { whatsappKPIs, whatsappAnalyticsData } from '@/data/chart-data';
import { AppShell } from '@/components/layouts/app-shell';

const rainbowChartColors = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
];

const successRateData = [
  { name: 'Delivered', value: 27000, color: rainbowChartColors[3] },
  { name: 'Failed', value: 1000, color: rainbowChartColors[0] },
];

export default function WhatsAppAnalyticsPage() {
  return (
    <AppShell>
      <PageHeader title="Messaging Analytics" description="WhatsApp message delivery performance" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whatsappKPIs.slice(3).map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Performance</CardTitle>
            <CardDescription>Sent, delivered, read & failed over 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={whatsappAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="sent" stroke={rainbowChartColors[5]} strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke={rainbowChartColors[3]} strokeWidth={2} />
                <Line type="monotone" dataKey="read" stroke={rainbowChartColors[7]} strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke={rainbowChartColors[0]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Delivered vs failed messages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={successRateData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {successRateData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages Sent</CardTitle>
            <CardDescription>Weekly volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={whatsappAnalyticsData}>
                <defs>
                  <linearGradient id="sentArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={rainbowChartColors[5]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={rainbowChartColors[5]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="sent" stroke={rainbowChartColors[5]} fill="url(#sentArea)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Read Rate</CardTitle>
            <CardDescription>Messages read vs delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={whatsappAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="delivered" fill={rainbowChartColors[3]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="read" fill={rainbowChartColors[7]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
