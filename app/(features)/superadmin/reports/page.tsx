'use client';

import * as React from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Users, Building2, CreditCard, MessageCircle, Activity } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { revenueData, businessGrowthData, paymentTrendsData, churnData, whatsappAnalyticsData, apiUsageData } from '@/data/chart-data';
import { subscriptionDistributionData, industryDistributionData } from '@/data/chart-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layouts/app-shell';

const reportTypes = [
  { label: 'Revenue', icon: DollarSign, color: 'text-green-500' },
  { label: 'Businesses', icon: Building2, color: 'text-blue-500' },
  { label: 'Users', icon: Users, color: 'text-purple-500' },
  { label: 'Payments', icon: CreditCard, color: 'text-indigo-500' },
  { label: 'Subscriptions', icon: CreditCard, color: 'text-teal-500' },
  { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500' },
  { label: 'API Usage', icon: Activity, color: 'text-cyan-500' },
  { label: 'Churn', icon: TrendingDown, color: 'text-red-500' },
  { label: 'Growth', icon: TrendingUp, color: 'text-amber-500' },
];

function formatCurrencyTooltip(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value ?? 0);
  return `KES ${amount.toLocaleString()}`;
}

function formatPercentTooltip(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value ?? 0);
  return `${amount}%`;
}

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader title="Reports & Analytics" description="Comprehensive reporting and data insights">
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting to PDF...')}>
          <Download className="h-4 w-4" /> Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting to Excel...')}>
          <FileText className="h-4 w-4" /> Export Excel
        </Button>
        <Button size="sm" onClick={() => toast.success('Scheduled report created')}>Schedule Report</Button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {reportTypes.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50">
              <Icon className={cn('h-4 w-4', r.color)} />
              <span className="font-medium">{r.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex items-center gap-4 rounded-xl border bg-card p-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Date Range:</span>
          <Button variant="outline" size="sm">Jan 1, 2024 - Jul 26, 2024</Button>
          <Button variant="ghost" size="sm">Last 7 days</Button>
          <Button variant="ghost" size="sm">Last 30 days</Button>
          <Button variant="ghost" size="sm">Last quarter</Button>
          <Button variant="ghost" size="sm">This year</Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="churn">Churn</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (Monthly)</CardTitle>
                <CardDescription>Monthly revenue vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData.monthly}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={formatCurrencyTooltip} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                    <Area type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Target" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Year</CardTitle>
                <CardDescription>Annual revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData.yearly}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={formatCurrencyTooltip} />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="target" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Growth</CardTitle>
                <CardDescription>Registrations, active, churn & renewals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={businessGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="registrations" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="active" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="churn" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    <Line type="monotone" dataKey="renewals" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Businesses by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={industryDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {industryDistributionData.map((entry, i) => (
                        <Cell key={i} fill={entry.color as string} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Trends</CardTitle>
              <CardDescription>Revenue, failed payments & refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={paymentTrendsData}>
                  <defs>
                    <linearGradient id="payRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={formatCurrencyTooltip} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#payRev)" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="refunds" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Active plans breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={subscriptionDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                    {subscriptionDistributionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color as string} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Messaging Analytics</CardTitle>
              <CardDescription>Sent, delivered, read & failed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={whatsappAnalyticsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="sent" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="read" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Requests and errors throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="requests" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="errors" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Churn Rate</CardTitle>
              <CardDescription>Monthly customer churn percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={churnData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={formatPercentTooltip} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
