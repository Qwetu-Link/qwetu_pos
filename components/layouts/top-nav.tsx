'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  Bell,
  Plus,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Building2,
  Users,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notifications } from '@/data/mock-data';
import { cn } from '@/utils/utils';
import { Badge } from '../ui/badge';

interface TopNavProps {
  onMobileMenuClick: () => void;
  onCommandPaletteOpen: () => void;
}

const routeLabels: Record<string, string> = {
  '/superadmin/': 'Dashboard',
  '/superadmin/businesses': 'Businesses',
  '/superadmin/subscriptions': 'Subscriptions',
  '/superadmin/whatsapp': 'WhatsApp Cloud',
  '/superadmin/reports': 'Reports & Analytics',
  '/superadmin/payments': 'Payments',
  '/superadmin/support': 'Support Center',
  '/superadmin/notifications': 'Notifications',
  '/superadmin/administrators': 'Administrators',
  '/superadmin/settings': 'System Settings',
};

export function TopNav({ onMobileMenuClick, onCommandPaletteOpen }: TopNavProps) {
  const pathname = usePathname();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];
    let acc = '';
    for (const seg of segments) {
      acc += '/' + seg;
      const label = routeLabels[acc] || seg.charAt(0).toUpperCase() + seg.slice(1);
      crumbs.push({ label, href: acc });
    }
    return crumbs;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <nav className="hidden items-center gap-1.5 text-sm md:flex">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <Link
              href={crumb.href}
              className={cn(
                'transition-colors hover:text-foreground',
                i === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-9 gap-2 text-muted-foreground md:flex"
          onClick={onCommandPaletteOpen}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
          <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">âŒ˜K</kbd>
        </Button>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={onCommandPaletteOpen}>
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2">
                <div className="flex w-full items-center gap-2">
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.message}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/superadmin/notifications" className="w-full justify-center text-sm text-primary">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Plus className="h-[18px] w-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/superadmin/businesses"><Building2 className="mr-2 h-4 w-4" />Add Business</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/superadmin/administrators"><Users className="mr-2 h-4 w-4" />Add Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/superadmin/plans"><CreditCard className="mr-2 h-4 w-4" />Create Plan</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/superadmin/whatsapp"><FileText className="mr-2 h-4 w-4" />New Template</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                AT
              </div>
              <div className="hidden flex-col items-start leading-tight lg:flex">
                <span className="text-sm font-medium">Alex Thornton</span>
                <span className="text-xs text-muted-foreground">Super Admin</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/superadmin/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
