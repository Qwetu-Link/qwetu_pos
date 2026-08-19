'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  UserPlus,
  CreditCard,
  MessageCircle,
  Ban,
  Settings,
  LogIn,
  CheckCircle2,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardKPIs, revenueData, businessGrowthData, subscriptionDistributionData, industryDistributionData } from '@/data/chart-data';
import { AppShell } from '@/components/layouts/app-shell';
import { activityFeed } from '@/data/mock-data';
import { cn } from '@/utils/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const activityIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  registration: { icon: UserPlus, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  renewal: { icon: CreditCard, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  payment: { icon: DollarSign, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  whatsapp_connected: { icon: MessageCircle, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
  suspended: { icon: Ban, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  new_admin: { icon: UserPlus, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  login: { icon: LogIn, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  settings_update: { icon: Settings, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  subscription_change: { icon: RefreshCw, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
};

type RevenueTab = 'daily' | 'weekly' | 'monthly' | 'yearly';

const revenueTabs = new Set<string>(['daily', 'weekly', 'monthly', 'yearly']);

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [revenueTab, setRevenueTab] = React.useState<RevenueTab>('monthly');
  const chartData = revenueData[revenueTab];

  return (
    <AppShell>
      <PageHeader title="Dashboard" description="Overview of your ERP/POS SaaS platform performance">
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm">Download Report</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue trends across different time periods</CardDescription>
              </div>
              <Tabs
                value={revenueTab}
                onValueChange={(value) => {
                  if (revenueTabs.has(value)) {
                    setRevenueTab(value as RevenueTab);
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => {
                    const amount = typeof value === 'number' ? value : Number(value ?? 0);
                    return `KES ${amount.toLocaleString()}`;
                  }}
                />
                <Area type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" fill="url(#colorTarget)" strokeWidth={1.5} strokeDasharray="5 5" name="Target" />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="url(#colorRevenue)" strokeWidth={2.5} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Active plans breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={subscriptionDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {subscriptionDistributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color as string} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {subscriptionDistributionData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color as string }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value} businesses</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Business Growth</CardTitle>
            <CardDescription>Registrations, active, churn & renewals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={businessGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
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
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={industryDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {industryDistributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color as string} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="scrollbar-thin max-h-[320px] space-y-1 overflow-y-auto pr-2">
              {activityFeed.map((activity, i) => {
                const config = activityIcons[activity.type];
                const Icon = config?.icon || CheckCircle2;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config?.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium leading-tight">{activity.title}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(activity.date)} - {activity.actor}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
