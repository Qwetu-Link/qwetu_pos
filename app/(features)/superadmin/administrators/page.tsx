'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, MoreHorizontal, Edit, Trash2, Mail, Save, Crown, WalletCards, Workflow, Headset, Eye } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/status-badges';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminUsers } from '@/data/mock-data';
import type { AdminRole, AdminUser } from '@/types/super-admin/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Finance': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Operations': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Customer Support': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Read Only': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const roleKpiConfig: Record<AdminRole, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  'Super Admin': { icon: Crown, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  Finance: { icon: WalletCards, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  Operations: { icon: Workflow, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'Customer Support': { icon: Headset, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  'Read Only': { icon: Eye, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
};

const adminRoles: AdminRole[] = ['Super Admin', 'Finance', 'Operations', 'Customer Support', 'Read Only'];

const permissionOptions = [
  'businesses',
  'registrations',
  'subscriptions',
  'payments',
  'plans',
  'reports',
  'whatsapp',
  'support',
  'notifications',
  'settings',
  'view',
  'all',
];

function AdministratorForm({
  admin,
  submitLabel,
  onSubmit,
}: {
  admin?: AdminUser;
  submitLabel: string;
  onSubmit: () => void;
}) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${admin?.id || 'new'}-name`}>Full Name</Label>
          <Input id={`${admin?.id || 'new'}-name`} defaultValue={admin?.name} placeholder="Jane Admin" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${admin?.id || 'new'}-email`}>Email</Label>
          <Input id={`${admin?.id || 'new'}-email`} type="email" defaultValue={admin?.email} placeholder="admin@qwetu.com" required />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select defaultValue={admin?.role || 'Operations'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {adminRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue={admin?.status || 'active'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3">
          {permissionOptions.map((permission) => (
            <label key={permission} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                defaultChecked={admin?.permissions.includes(permission)}
                className="h-4 w-4 rounded border-border"
              />
              {permission}
            </label>
          ))}
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">
          <Save className="h-4 w-4" /> {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AdministratorsPage() {
  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: 'Administrator',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{row.original.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', roleColors[row.original.role])}>
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.original.lastLogin).toLocaleString()}</span>,
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.permissions.map((p) => (
            <Badge key={p} variant="outline" className="text-xs capitalize">{p}</Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger>
                  <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={() => toast.success(`Email queued for ${row.original.name}`)}>
                  <Mail className="mr-2 h-4 w-4" /> Send Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger>
                  <DropdownMenuItem className="text-destructive" onSelect={(event) => event.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Administrator</DialogTitle>
                <DialogDescription>Update role, status, and permissions for {row.original.name}.</DialogDescription>
              </DialogHeader>
              <AdministratorForm
                admin={row.original}
                submitLabel="Update Admin"
                onSubmit={() => toast.success(`${row.original.name} updated`)}
              />
            </DialogContent>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove {row.original.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revoke administrator access for {row.original.email}. This action should only be used after confirming ownership of active tasks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => toast.error(`${row.original.name} removed`)}
                >
                  Remove Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      ),
    },
  ];

  const roleStats = adminRoles.map(role => ({
    role,
    count: adminUsers.filter(a => a.role === role).length,
  }));

  return (
    <AppShell>
      <PageHeader title="Administrators" description="Manage Super Admin users and permissions">
        <Dialog>
          <DialogTrigger>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Administrator</DialogTitle>
              <DialogDescription>Create a new admin account and assign permissions.</DialogDescription>
            </DialogHeader>
            <AdministratorForm
              submitLabel="Create Admin"
              onSubmit={() => toast.success('Administrator created')}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {roleStats.map((s) => {
          const config = roleKpiConfig[s.role];
          const Icon = config.icon;

          return (
          <Card key={s.role}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{s.role}</span>
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', config.bg, config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-1 text-2xl font-bold">{s.count}</p>
            </CardContent>
          </Card>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-4 lg:p-6">
        <DataTable
          columns={columns}
          data={adminUsers}
          searchKey="name"
          searchPlaceholder="Search administrators..."
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}
