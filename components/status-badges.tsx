'use client';

import { cn } from '@/utils/utils';
import * as React from 'react';

type StatusType = 'active' | 'trial' | 'suspended' | 'expired' | 'paid' | 'pending' | 'failed' | 'refunded' | 'connected' | 'disconnected' | 'approved' | 'rejected' | 'info_requested' | 'valid' | 'invalid' | 'open' | 'resolved' | 'closed';

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  connected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  disconnected: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info_requested: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  valid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  invalid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function StatusBadge({ status }: { status: string | boolean | null | undefined }) {
  const normalizedStatus =
    typeof status === 'boolean'
      ? status ? 'connected' : 'disconnected'
      : String(status ?? 'unknown').toLowerCase();
  const style = statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  const label = normalizedStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        style
      )}
    >
      {label}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    Trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Enterprise: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles[plan] || styles.Starter)}>
      {plan}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', styles[severity] || styles.low)}>
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', styles[priority] || styles.low)}>
      {priority}
    </span>
  );
}
