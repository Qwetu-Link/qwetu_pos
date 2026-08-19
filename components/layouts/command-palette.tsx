'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CreditCard,
  Wallet,
  BarChart3,
  Shield,
  FileText,
  Settings,
  LayoutDashboard,
  MessageCircle,
  Bell,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { businesses, adminUsers, subscriptions, payments, whatsappTemplates } from '@/data/mock-data';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const navCommands = [
  { label: 'Dashboard', href: '/superadmin/', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Businesses', href: '/superadmin/businesses', icon: Building2, group: 'Navigation' },
  { label: 'Subscriptions', href: '/superadmin/subscriptions', icon: CreditCard, group: 'Navigation' },
  { label: 'WhatsApp Cloud', href: '/superadmin/whatsapp', icon: MessageCircle, group: 'Navigation' },
  { label: 'Reports & Analytics', href: '/superadmin/reports', icon: BarChart3, group: 'Navigation' },
  { label: 'Payments', href: '/superadmin/payments', icon: Wallet, group: 'Navigation' },
  { label: 'Notifications', href: '/superadmin/notifications', icon: Bell, group: 'Navigation' },
  { label: 'Administrators', href: '/superadmin/administrators', icon: Shield, group: 'Navigation' },
  { label: 'System Settings', href: '/superadmin/settings', icon: Settings, group: 'Navigation' },
];

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search businesses, users, pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <CommandItem key={cmd.href} onSelect={() => navigate(cmd.href)}>
                <Icon className="mr-2 h-4 w-4" />
                {cmd.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Businesses">
          {businesses.slice(0, 6).map((b) => (
            <CommandItem key={b.id} onSelect={() => navigate(`/businesses/${b.id}`)}>
              <Building2 className="mr-2 h-4 w-4" />
              {b.name}
              <span className="ml-2 text-xs text-muted-foreground">{b.industry}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Administrators">
          {adminUsers.slice(0, 5).map((a) => (
            <CommandItem key={a.id} onSelect={() => navigate('/administrators')}>
              <Shield className="mr-2 h-4 w-4" />
              {a.name}
              <span className="ml-2 text-xs text-muted-foreground">{a.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Subscriptions">
          {subscriptions.slice(0, 5).map((s) => (
            <CommandItem key={s.id} onSelect={() => navigate('/subscriptions')}>
              <CreditCard className="mr-2 h-4 w-4" />
              {s.businessName}
              <span className="ml-2 text-xs text-muted-foreground">{s.plan}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Payments">
          {payments.slice(0, 5).map((p) => (
            <CommandItem key={p.id} onSelect={() => navigate('/payments')}>
              <Wallet className="mr-2 h-4 w-4" />
              {p.invoice} - {p.businessName}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="WhatsApp Templates">
          {whatsappTemplates.slice(0, 5).map((t) => (
            <CommandItem key={t.id} onSelect={() => navigate('/whatsapp')}>
              <FileText className="mr-2 h-4 w-4" />
              {t.name}
              <span className="ml-2 text-xs text-muted-foreground">{t.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
