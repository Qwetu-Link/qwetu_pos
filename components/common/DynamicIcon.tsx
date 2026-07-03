import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  // Graceful fallbacks for font-awesome names mapped to Lucide lookalikes
  const iconMap: Record<string, keyof typeof Icons> = {
    ChartLine: 'TrendingUp',
    Tags: 'Tag',
    Cubes: 'Boxes',
    Boxes: 'Package',
    Tasks: 'ClipboardList',
    Users: 'Users',
    DollarSign: 'DollarSign',
    HandHoldingUsd: 'HandCoins',
    ChartPie: 'PieChart',
    FileText: 'FileText',
    Settings: 'Settings',
  };

  const LucideIcon = Icons[iconMap[name] || (name as keyof typeof Icons)] as React.ComponentType<{ className?: string }>;

  if (!LucideIcon) {
    return <Icons.HelpCircle className={className} />;
  }

  return <LucideIcon className={className} />;
};