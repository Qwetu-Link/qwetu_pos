'use client';

import * as React from 'react';
import { Bell, Check, Archive, Building2, CreditCard, DollarSign, MessageCircle, Shield, Settings, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notifications as initialNotifications } from '@/data/mock-data';
import type { AppNotification, NotificationCategory } from '@/types/super-admin/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

const categoryIcons: Record<NotificationCategory, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  business: { icon: Building2, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  subscription: { icon: CreditCard, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  payment: { icon: DollarSign, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  whatsapp: { icon: MessageCircle, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
  system: { icon: Settings, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  security: { icon: Shield, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

type NotificationFilter = 'all' | 'unread' | 'archived';

const notificationFilters = new Set<string>(['all', 'unread', 'archived']);

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(initialNotifications);
  const [filter, setFilter] = React.useState<NotificationFilter>('all');

  const filtered = filter === 'all'
    ? notifications.filter(n => !n.archived)
    : filter === 'unread'
    ? notifications.filter(n => !n.read && !n.archived)
    : notifications.filter(n => n.archived);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Marked as read');
  };

  const archive = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: true } : n));
    toast.success('Archived');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  return (
    <AppShell>
      <PageHeader title="Notifications" description="Stay updated on platform activities">
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <Check className="h-4 w-4" /> Mark All Read
        </Button>
      </PageHeader>

      <Tabs
        value={filter}
        onValueChange={(value) => {
          if (notificationFilters.has(value)) {
            setFilter(value as NotificationFilter);
          }
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((n) => {
            const config = categoryIcons[n.category];
            const Icon = config?.icon || AlertCircle;
            return (
              <Card key={n.id} className={cn('transition-all', !n.read && 'border-primary/30 bg-primary/5')}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config?.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      <p className="font-medium">{n.title}</p>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', priorityColors[n.priority])}>
                        {n.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(n.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && (
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => markAsRead(n.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => archive(n.id)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
