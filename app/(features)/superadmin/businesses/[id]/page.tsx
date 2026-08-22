'use client';

import * as React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Users,
  Building,
  CreditCard,
  DollarSign,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Ban,
} from 'lucide-react';
import { AppShell } from '@/components/layouts/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { StatusBadge, PlanBadge } from '@/components/status-badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/uii/table';
import { businesses, businessUsers, branches, payments, activityFeed } from '@/data/mock-data';
// import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const profileTabs = new Set(['overview', 'subscription', 'payments', 'users', 'branches', 'activity']);

const planPrices: Record<string, string> = {
  Trial: '0',
  Starter: '5,500',
  Professional: '18,500',
  Enterprise: '45,000',
};

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const business = businesses.find((b) => b.id === params.id) || businesses[0];
  const users = businessUsers.filter((u) => u.businessId === business.id);
  const businessBranches = branches.filter((b) => b.businessId === business.id);
  const businessPayments = payments.filter((p) => p.businessId === business.id);
  const businessActivity = activityFeed.slice(0, 8);

  // const successRate = 96.5;
  const requestedTab = searchParams.get('tab') || 'overview';
  const selectedTab = profileTabs.has(requestedTab) ? requestedTab : 'overview';

  return (
    <AppShell>
      <div className="mb-4">
        <Link href="/superadmin/businesses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Businesses
          </Button>
        </Link>
      </div>

      <PageHeader title={business.businessName} description={business.description}>
        <Button variant="outline" size="sm">
          <Link href={`/superadmin/businesses/${business.id}/edit`}>Edit</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success('Sending invite...')}>Invite User</Button>
        <Button size="sm">
          <Link href={`/superadmin/businesses/${business.id}?tab=subscription`}>Manage Subscription</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
            <Ban className="h-4 w-4" /> Suspend
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suspend {business.businessName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will block access for all business users, pause subscription activity, and mark the business as suspended.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => toast.error(`${business.businessName} suspended`)}
              >
                Suspend Business
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageHeader>

      <Tabs
        value={selectedTab}
        onValueChange={(tab) => router.push(`/superadmin/businesses/${business.id}?tab=${tab}`)}
        className="space-y-6"
      >
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                    {business.logoPath}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{business.businessName}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={business.status} />
                      <PlanBadge plan={business.plan} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">Owner Name</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{business.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{business.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{business.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{business.industry}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Joined: {business.createdAt}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              {[
                { label: 'Active Users', value: business.users, icon: Users, color: 'text-blue-500' },
                { label: 'Active Branches', value: business.branches, icon: Building, color: 'text-purple-500' },
                { label: 'Monthly Revenue', value: `KES ${(0).toFixed(1)}M`, icon: DollarSign, color: 'text-green-500' },
                { label: 'Plan', value: business.plan, icon: CreditCard, color: 'text-indigo-500' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-muted', stat.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Subscription Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Current Plan</p>
                      <p className="font-semibold"><PlanBadge plan={business.plan} /></p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-semibold"><StatusBadge status={business.status} /></p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">WhatsApp</p>
                      <p className="font-semibold"><StatusBadge status={business.whatsappStatus ? 'connected' : 'disconnected'} /></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                      <p className="text-lg font-bold text-green-600">KES {businessPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-lg font-bold text-amber-600">KES {businessPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Invoices</p>
                      <p className="text-lg font-bold">{businessPayments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Plan details and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="mt-1"><PlanBadge plan={business.plan} /></p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="mt-1"><StatusBadge status={business.status} /></p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Monthly Cost</p>
                    <p className="mt-1 font-semibold">KES {business.plan === 'Enterprise' ? '45,000' : business.plan === 'Professional' ? '18,500' : business.plan === 'Starter' ? '5,500' : '0'}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="mt-1 font-semibold capitalize">Monthly</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Renewal Date</p>
                    <p className="mt-1 font-semibold">Aug 15, 2024</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Auto Renewal</p>
                    <p className="mt-1 font-semibold">{business.status === 'active' ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger render={<Button size="sm" />}>
                      <ArrowUpCircle className="h-4 w-4" /> Upgrade
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Upgrade Subscription</DialogTitle>
                        <DialogDescription>Move {business.businessName} to a higher plan and apply the new limits.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Current Plan</Label>
                          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                            <PlanBadge plan={business.plan} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>New Plan</Label>
                          <Select defaultValue="Enterprise">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professional">Professional - KES {planPrices.Professional}</SelectItem>
                              <SelectItem value="Enterprise">Enterprise - KES {planPrices.Enterprise}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Billing Cycle</Label>
                          <Select defaultValue="monthly">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upgrade-date">Effective Date</Label>
                          <Input id="upgrade-date" type="date" defaultValue="2024-08-15" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                          Cancel
                        </DialogClose>
                        <Button type="button" onClick={() => toast.success(`${business.businessName} upgrade scheduled`)}>
                          Confirm Upgrade
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={<Button size="sm" variant="outline" />}>
                      <ArrowDownCircle className="h-4 w-4" /> Downgrade
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Downgrade Subscription</DialogTitle>
                        <DialogDescription>Choose a lower plan and confirm how the limit changes should be applied.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                          Downgrading can reduce user seats, branches, API limits, and WhatsApp messaging allowance.
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Target Plan</Label>
                            <Select defaultValue="Starter">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Trial">Trial - KES {planPrices.Trial}</SelectItem>
                                <SelectItem value="Starter">Starter - KES {planPrices.Starter}</SelectItem>
                                <SelectItem value="Professional">Professional - KES {planPrices.Professional}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Apply Changes</Label>
                            <Select defaultValue="renewal">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="renewal">At next renewal</SelectItem>
                                <SelectItem value="immediate">Immediately</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                          Cancel
                        </DialogClose>
                        <Button type="button" onClick={() => toast.success(`${business.businessName} downgrade scheduled`)}>
                          Confirm Downgrade
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={<Button size="sm" variant="outline" />}>
                      <RefreshCw className="h-4 w-4" /> Renew
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Renew Subscription</DialogTitle>
                        <DialogDescription>Record a renewal for the current {business.plan} plan.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="renewal-start">Renewal Start</Label>
                          <Input id="renewal-start" type="date" defaultValue="2024-08-15" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="renewal-end">New Expiry</Label>
                          <Input id="renewal-end" type="date" defaultValue="2024-09-15" />
                        </div>
                        <div className="space-y-2">
                          <Label>Billing Cycle</Label>
                          <Select defaultValue="monthly">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="renewal-amount">Amount</Label>
                          <Input id="renewal-amount" defaultValue={`KES ${planPrices[business.plan]}`} />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                          Cancel
                        </DialogClose>
                        <Button type="button" onClick={() => toast.success(`${business.businessName} subscription renewed`)}>
                          Confirm Renewal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger render={<Button size="sm" variant="destructive" />}>
                      Cancel
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will stop future renewals for {business.businessName}. Existing access remains governed by the current expiry date unless the business is suspended separately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => toast.error(`${business.businessName} subscription cancelled`)}
                        >
                          Confirm Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Capacity</CardTitle>
                <CardDescription>Included users and branches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'User Licenses', used: 0, total: business.plan === 'Enterprise' ? 999 : business.plan === 'Professional' ? 50 : 10, unit: '', color: 'bg-purple-500' },
                  { label: 'Branches', used: 0, total: business.plan === 'Enterprise' ? 999 : business.plan === 'Professional' ? 10 : 2, unit: '', color: 'bg-blue-500' },
                ].map((u) => (
                  <div key={u.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{u.label}</span>
                      <span className="font-medium">{u.used}{u.unit} / {u.total}{u.unit}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full', u.color)}
                        style={{ width: `${(u.used / u.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All transactions for this business</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessPayments.length > 0 ? businessPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.invoice}</TableCell>
                      <TableCell>KES {p.amount.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                      <TableCell className="text-muted-foreground">{p.description}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No payments yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>Active users in this business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-xl border p-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">{user.role}</span>
                        <StatusBadge status={user.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessBranches.map((branch) => (
              <Card key={branch.id}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{branch.name}</p>
                      <StatusBadge status={branch.status} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {branch.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Manager: {branch.manager}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {branch.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {branch.users} users
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Chronological events for this business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6">
                <div className="absolute left-2 top-2 h-full w-px bg-border" />
                {businessActivity.map((event, i) => (
                  <div key={event.id} className="relative">
                    <div className={cn(
                      'absolute -left-[18px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background',
                      i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-amber-500'
                    )} />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()} - {event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
