'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Download, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/kpi-card';
import { StatusBadge, PlanBadge } from '@/components/status-badges';
import { subscriptionKPIs } from '@/data/chart-data';
import { subscriptions } from '@/data/mock-data';
import type { Subscription } from '@/types/super-admin/types';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

export default function SubscriptionsPage() {
  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: 'businessName',
      header: 'Business',
      cell: ({ row }) => <span className="font-medium">{row.original.businessName}</span>,
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
    },
    {
      accessorKey: 'billingCycle',
      header: 'Billing',
      cell: ({ row }) => <span className="capitalize text-sm">{row.original.billingCycle}</span>,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="font-medium">KES {row.original.price.toLocaleString()}</span>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    },
    {
      accessorKey: 'renewalDate',
      header: 'Renewal Date',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.renewalDate}</span>,
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.expiryDate}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'autoRenewal',
      header: 'Auto Renew',
      cell: ({ row }) => (
        <span className={row.original.autoRenewal ? 'text-green-600' : 'text-muted-foreground'}>
          {row.original.autoRenewal ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Subscriptions" description="Manage all platform subscriptions">
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting subscriptions...')}>
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" onClick={() => toast.success('Bulk renew initiated')}>
          <RefreshCw className="h-4 w-4" /> Bulk Renew
        </Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subscriptionKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4 lg:p-6">
        <DataTable
          columns={columns}
          data={subscriptions}
          searchKey="businessName"
          searchPlaceholder="Search subscriptions..."
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}
