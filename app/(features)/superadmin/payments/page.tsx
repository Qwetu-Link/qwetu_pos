'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badges';
import { payments } from '@/data/mock-data';
import { paymentTrendsData } from '@/data/chart-data';
import type { Payment } from '@/types/super-admin/types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Legend } from 'recharts';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

const paymentKPIs = [
  { label: 'Total Revenue', value: 7100000, format: 'currency' as const, growth: 14.5, previousValue: 6200000, sparkline: [4.2, 4.5, 5.1, 4.8, 5.6, 6.2, 7.1], icon: 'DollarSign', color: 'text-green-500' },
  { label: 'Transactions', value: 18450, format: 'number' as const, growth: 18.3, previousValue: 15600, sparkline: [12000, 13500, 14000, 15600, 16800, 17500, 18450], icon: 'Receipt', color: 'text-blue-500' },
  { label: 'Failed Payments', value: 2, format: 'number' as const, growth: -33.3, previousValue: 3, sparkline: [3, 3, 2, 2, 2, 2, 2], icon: 'AlertCircle', color: 'text-red-500' },
  { label: 'Refunds', value: 1, format: 'number' as const, growth: 0, previousValue: 1, sparkline: [1, 1, 1, 1, 1, 1, 1], icon: 'RotateCcw', color: 'text-purple-500' },
];

function formatCurrencyTooltip(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value ?? 0);
  return `KES ${amount.toLocaleString()}`;
}

export default function PaymentsPage() {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'invoice',
      header: 'Invoice',
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.invoice}</span>,
    },
    {
      accessorKey: 'businessName',
      header: 'Business',
      cell: ({ row }) => <span className="text-sm">{row.original.businessName}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-medium">KES {row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => <span className="text-sm">{row.original.method}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.date}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading receipt for ${row.original.invoice}`)}>
          Receipt
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Payments" description="View and manage all platform transactions">
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting payments...')}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {paymentKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
          <CardDescription>Revenue, failed payments & refunds over 7 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={paymentTrendsData}>
              <defs>
                <linearGradient id="payRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={formatCurrencyTooltip} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#payRevGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" strokeWidth={2} />
              <Line type="monotone" dataKey="refunds" stroke="hsl(var(--chart-4))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-card p-4 lg:p-6">
        <DataTable
          columns={columns}
          data={payments}
          searchKey="businessName"
          searchPlaceholder="Search payments..."
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}
