'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, RefreshCw, Trash2, Power } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badges';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { whatsappConnections } from '@/data/mock-data';
import type { WhatsAppConnection } from '@/types/super-admin/types';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

export default function WhatsAppConnectionsPage() {
  const columns: ColumnDef<WhatsAppConnection>[] = [
    {
      accessorKey: 'businessName',
      header: 'Business',
      cell: ({ row }) => <span className="font-medium">{row.original.businessName}</span>,
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => <span className="text-sm">{row.original.phoneNumber}</span>,
    },
    {
      accessorKey: 'phoneNumberId',
      header: 'Phone Number ID',
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.phoneNumberId}</span>,
    },
    {
      accessorKey: 'businessAccountId',
      header: 'Business Account ID',
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.businessAccountId}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'tokenStatus',
      header: 'Token',
      cell: ({ row }) => <StatusBadge status={row.original.tokenStatus} />,
    },
    {
      accessorKey: 'lastSync',
      header: 'Last Sync',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.original.lastSync).toLocaleString()}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success('Syncing connection...')}>
              <RefreshCw className="mr-2 h-4 w-4" /> Sync
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success('Reconnecting...')}>
              <Power className="mr-2 h-4 w-4" /> Reconnect
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => toast.error('Disconnect requires confirmation')}>
              <Trash2 className="mr-2 h-4 w-4" /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="WhatsApp Connections" description="Manage all WhatsApp Business phone number connections">
        <Button size="sm" onClick={() => toast.success('Add connection dialog would open')}>Add Connection</Button>
      </PageHeader>

      <div className="rounded-xl border bg-card p-4 lg:p-6">
        <DataTable
          columns={columns}
          data={whatsappConnections}
          searchKey="businessName"
          searchPlaceholder="Search connections..."
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}
