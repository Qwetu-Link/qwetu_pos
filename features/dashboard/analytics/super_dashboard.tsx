'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
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
import { AppShell } from '@/components/layouts/app-shell';
import { cn } from '@/utils/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartDataPoint, KPIData } from '@/types/super-admin/types';

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

type DashboardActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: string;
  date: string;
};

type SuperAdminDashboardData = {
  kpis: KPIData[];
  revenueData: Record<RevenueTab, ChartDataPoint[]>;
  businessGrowthData: ChartDataPoint[];
  subscriptionDistributionData: ChartDataPoint[];
  activityFeed: DashboardActivity[];
};

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

const chartColors = {
  revenueStart: rainbowChartColors[0],
  revenueMid: rainbowChartColors[3],
  revenueEnd: rainbowChartColors[6],
  target: rainbowChartColors[7],
  registrations: rainbowChartColors[0],
  active: rainbowChartColors[3],
  churn: rainbowChartColors[2],
  renewals: rainbowChartColors[6],
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [revenueTab, setRevenueTab] = React.useState<RevenueTab>('monthly');
  const [dashboardData, setDashboardData] = React.useState<SuperAdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const chartData = dashboardData?.revenueData[revenueTab] ?? [];
  const kpis = dashboardData?.kpis ?? [];
  const businessGrowthData = dashboardData?.businessGrowthData ?? [];
  const subscriptionDistributionData = dashboardData?.subscriptionDistributionData ?? [];
  const activityFeed = dashboardData?.activityFeed ?? [];

  React.useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/superadmin/dashboard', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load dashboard');
        const { data } = await response.json() as { data: SuperAdminDashboardData };
        if (isMounted) {
          setDashboardData(data);
        }
      } catch {
        if (isMounted) {
          setDashboardData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell>
      <PageHeader title="Dashboard" description="Overview of your ERP/POS SaaS platform performance">
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm">Download Report</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-[138px] animate-pulse bg-muted/40" />
          ))
        ) : kpis.length > 0 ? (
          kpis.map((kpi, i) => (
            <KPICard key={kpi.label} {...kpi} index={i} />
          ))
        ) : (
          <Card className="p-5 sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <p className="text-sm text-muted-foreground">No dashboard metrics available yet.</p>
          </Card>
        )}
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
            {isLoading ? (
              <div className="h-[320px] animate-pulse rounded-md bg-muted/40" />
            ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueRainbowStroke" x1="0" y1="0" x2="1" y2="0">
                    {rainbowChartColors.map((color, i) => (
                      <stop key={color} offset={`${(i / (rainbowChartColors.length - 1)) * 100}%`} stopColor={color} />
                    ))}
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.revenueStart} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={chartColors.revenueMid} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={chartColors.revenueEnd} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.target} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartColors.target} stopOpacity={0} />
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
                <Area type="monotone" dataKey="target" stroke={chartColors.target} fill="url(#colorTarget)" strokeWidth={1.5} strokeDasharray="5 5" name="Target" />
                <Area type="monotone" dataKey="value" stroke="url(#revenueRainbowStroke)" fill="url(#colorRevenue)" strokeWidth={2.5} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Active plans breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[240px] animate-pulse rounded-md bg-muted/40" />
            ) : (
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
                    <Cell key={entry.name} fill={rainbowChartColors[i % rainbowChartColors.length]} />
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
            )}
            <div className="mt-4 space-y-2">
              {subscriptionDistributionData.length > 0 ? subscriptionDistributionData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: rainbowChartColors[i % rainbowChartColors.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value} businesses</span>
                </div>
              )) : <p className="text-sm text-muted-foreground">No subscription data yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Growth</CardTitle>
            <CardDescription>Registrations, active, churn & renewals</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[280px] animate-pulse rounded-md bg-muted/40" />
            ) : (
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
                <Line type="monotone" dataKey="registrations" stroke={chartColors.registrations} strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke={chartColors.active} strokeWidth={2} />
                <Line type="monotone" dataKey="churn" stroke={chartColors.churn} strokeWidth={2} />
                <Line type="monotone" dataKey="renewals" stroke={chartColors.renewals} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="scrollbar-thin max-h-[320px] space-y-1 overflow-y-auto pr-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-lg bg-muted/40" />
                ))
              ) : activityFeed.length > 0 ? activityFeed.map((activity, i) => {
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
              }) : <p className="text-sm text-muted-foreground">No recent activity yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
