'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/sparkline';
import * as Icons from 'lucide-react';
import { cn } from '@/utils/utils';

interface KPICardProps {
  label: string;
  value: number;
  format: 'number' | 'currency' | 'percent';
  growth: number;
  previousValue: number;
  sparkline: number[];
  icon: string;
  color: string;
  index?: number;
}

type KPIIcon = React.ComponentType<{ className?: string }>;

function formatValue(value: number, format: string): string {
  if (format === 'currency') {
    if (value >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `KES ${(value / 1000).toFixed(0)}K`;
    return `KES ${value.toLocaleString()}`;
  }
  if (format === 'percent') return `${value}%`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

function isKPIIcon(value: unknown): value is KPIIcon {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

export function KPICard({ label, value, format, growth, previousValue, sparkline, icon, color, index = 0 }: KPICardProps) {
  const candidate = (Icons as Record<string, unknown>)[icon];
  const Icon: KPIIcon = isKPIIcon(candidate) ? candidate : Icons.Activity;
  const isPositive = growth > 0;
  const isNeutral = growth === 0;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
    >
      <Card className="group relative overflow-hidden p-5 transition-all hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold tracking-tight">{formatValue(value, format)}</span>
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-muted', color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-red-500'
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {isNeutral ? '0%' : `${isPositive ? '+' : ''}${growth}%`}
            </span>
            <span className="text-xs text-muted-foreground">vs {formatValue(previousValue, format)}</span>
          </div>
          <Sparkline data={sparkline} color={color} />
        </div>
      </Card>
    </motion.div>
  );
}
