'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle, Link2, FileText, BarChart3, Settings, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { KPICard } from '@/components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { whatsappKPIs, whatsappAnalyticsData } from '@/data/chart-data';
import { whatsappConnections } from '@/data/mock-data';
import { StatusBadge } from '@/components/status-badges';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppShell } from '@/components/layouts/app-shell';

const subModules = [
  { label: 'Connections', href: '/superadmin/whatsapp/connections', icon: Link2, desc: 'Manage WhatsApp phone numbers' },
  { label: 'Template Manager', href: '/superadmin/whatsapp/templates', icon: FileText, desc: 'Create and manage message templates' },
  { label: 'Messaging Analytics', href: '/superadmin/whatsapp/analytics', icon: BarChart3, desc: 'Message delivery insights' },
  { label: 'API Configuration', href: '/superadmin/whatsapp/config', icon: Settings, desc: 'WhatsApp Cloud API settings' },
];

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

export default function WhatsAppPage() {
  return (
    <AppShell>
      <PageHeader title="WhatsApp Cloud API" description="Manage WhatsApp Business messaging across the platform" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whatsappKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.href} href={mod.href}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{mod.label}</p>
                    <p className="text-xs text-muted-foreground">{mod.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Analytics</CardTitle>
            <CardDescription>Sent, delivered, read & failed over 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={whatsappAnalyticsData}>
                <defs>
                  <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={rainbowChartColors[5]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={rainbowChartColors[5]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={rainbowChartColors[3]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={rainbowChartColors[3]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="sent" stroke={rainbowChartColors[5]} fill="url(#sentGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="delivered" stroke={rainbowChartColors[3]} fill="url(#deliveredGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="read" stroke={rainbowChartColors[7]} fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Messages</CardTitle>
            <CardDescription>Delivery failures by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={whatsappAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="failed" radius={[4, 4, 0, 0]}>
                  {whatsappAnalyticsData.map((entry, i) => (
                    <Cell key={entry.name} fill={rainbowChartColors[i % rainbowChartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Connections</CardTitle>
          <CardDescription>Latest WhatsApp Business connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {whatsappConnections.slice(0, 5).map((conn) => (
              <div key={conn.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{conn.businessName}</p>
                    <p className="text-xs text-muted-foreground">{conn.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={conn.status} />
                  <StatusBadge status={conn.tokenStatus} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
