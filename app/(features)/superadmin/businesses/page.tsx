'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { MoreHorizontal, Eye, Edit, Trash2, Download, Upload, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge, PlanBadge } from '@/components/status-badges';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';
import { businesses } from '@/data/mock-data';
import { Business } from '@/types/super-admin/types';

export default function BusinessesPage() {
  const columns: ColumnDef<Business>[] = [
    {
      id: 'select',
      size: 28,
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Business',
      cell: ({ row }) => (
        <Link href={`/superadmin/businesses/${row.original.id}`} className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {row.original.logo}
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:text-primary">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.code}</span>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.owner}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
      cell: ({ row }) => <span className="text-sm">{row.original.industry}</span>,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => <span className="text-sm">{row.original.country}</span>,
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'users',
      header: 'Users',
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.users}</span>,
    },
    {
      accessorKey: 'branches',
      header: 'Branches',
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.branches}</span>,
    },
    {
      accessorKey: 'whatsappStatus',
      header: 'WhatsApp',
      cell: ({ row }) => <StatusBadge status={row.original.whatsappStatus} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.createdAt}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/superadmin/businesses/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => toast.error('Suspend action requires confirmation')}>
              <Trash2 className="mr-2 h-4 w-4" /> Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Businesses" description="Manage all businesses on the platform">
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting to CSV...')}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success('Exporting to Excel...')}>
          <Upload className="mr-2 h-4 w-4" /> Export Excel
        </Button>
        <Button size="sm">
          <Link href="/superadmin/businesses/addbusiness">
            <Building2 className="mr-2 h-4 w-4" /> Add Business
          </Link>
        </Button>
      </PageHeader>

      <div className="rounded-xl border bg-card p-4 lg:p-6">
        <DataTable
          columns={columns}
          data={businesses}
          searchKey="name"
          searchPlaceholder="Search businesses..."
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}
