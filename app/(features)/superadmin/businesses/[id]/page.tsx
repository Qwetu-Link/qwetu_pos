'use client';

import * as React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, Ban, Building, Calendar, CheckCircle2, CreditCard, DollarSign, KeyRound, Mail, MapPin, Phone, RefreshCw, UserPlus, Users } from 'lucide-react';
import { AppShell } from '@/components/layouts/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge, PlanBadge } from '@/components/status-badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/uii/table';
import type { Business as BusinessRecord } from '@/types/admin/business';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const profileTabs = new Set(['overview', 'subscription', 'payments', 'users', 'branches', 'change-password', 'activity']);
const planPrices: Record<SubscriptionPlan, number> = { Trial: 0, Starter: 5500, Professional: 18500, Enterprise: 45000 };

type SubscriptionPlan = 'Trial' | 'Starter' | 'Professional' | 'Enterprise';
type BillingCycle = 'monthly' | 'quartely' | 'semi-annual' | 'annual';

type ProfileUser = { id: string; name: string; email: string; phone?: string | null; avatar: string; role?: string | null; status: string; createdAt: string };
type ProfileBranch = { id: string; name: string; status: string; location: string; manager: string; phone: string; users: number; stock: number; reorderPoint: number; createdAt: string };
type ProfilePayment = { id: string; invoice: string; amount: number; status: string; method: string; date: string; description: string };
type ProfileActivity = { id: string; title: string; description: string; date: string; actor: string };
type ProfileSubscription = { id: string; plan: SubscriptionPlan; billingCycle: BillingCycle; price: number | null; paymentStatus: string; renewalDate?: string | null; expiryDate?: string | null; status?: string | null; autoRenewal: boolean };
type BusinessProfile = {
  business: BusinessRecord;
  users: ProfileUser[];
  branches: ProfileBranch[];
  payments: ProfilePayment[];
  subscription: ProfileSubscription | null;
  revenue: { paid: number; pending: number; invoices: number };
  activity: ProfileActivity[];
};

function formatDate(value?: string | Date | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

function normalizeBusiness(business: BusinessRecord): BusinessRecord {
  return {
    ...business,
    logoPath: business.logoPath || business.businessName.slice(0, 2).toUpperCase(),
    country: business.country || 'Kenya',
    createdAt: formatDate(business.createdAt),
    updatedAt: formatDate(business.updatedAt),
  };
}

function normalizeProfile(profile: BusinessProfile): BusinessProfile {
  return { ...profile, business: normalizeBusiness(profile.business) };
}

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [profile, setProfile] = React.useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMutating, setIsMutating] = React.useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = React.useState<SubscriptionPlan>('Professional');
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('monthly');
  const [autoRenewal, setAutoRenewal] = React.useState(true);

  const requestedTab = searchParams.get('tab') || 'overview';
  const selectedTab = profileTabs.has(requestedTab) ? requestedTab : 'overview';

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/superadmin/businesses/${businessId}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load business');
      const { data } = await response.json() as { data: BusinessProfile };
      const nextProfile = normalizeProfile(data);
      setProfile(nextProfile);
      setSubscriptionPlan(nextProfile.subscription?.plan ?? titleCasePlan(nextProfile.business.plan));
      setBillingCycle(nextProfile.subscription?.billingCycle ?? 'monthly');
      setAutoRenewal(nextProfile.subscription?.autoRenewal ?? true);
    } catch {
      setProfile(null);
      toast.error('Could not load business');
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function runProfileAction(body: Record<string, unknown>, successMessage: string) {
    setIsMutating(true);
    try {
      const response = await fetch(`/api/superadmin/businesses/${businessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Profile action failed');
      setProfile(normalizeProfile(payload.data));
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Profile action failed');
    } finally {
      setIsMutating(false);
    }
  }

  if (isLoading) {
    return <AppShell><div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading business...</div></AppShell>;
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="mb-4">
          <Link href="/superadmin/businesses"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Businesses</Button></Link>
        </div>
        <Card><CardContent className="flex h-40 items-center justify-center text-sm text-muted-foreground">Business not found.</CardContent></Card>
      </AppShell>
    );
  }

  const { business, users, branches, payments, subscription, revenue, activity } = profile;
  const currentPlan = subscription?.plan ?? titleCasePlan(business.plan);
  const monthlyCost = subscription?.price ?? planPrices[currentPlan];
  const branchCapacity = currentPlan === 'Enterprise' ? 999 : currentPlan === 'Professional' ? 10 : 2;
  const userCapacity = currentPlan === 'Enterprise' ? 999 : currentPlan === 'Professional' ? 50 : 10;
  const isSuspended = business.status === 'suspended';

  return (
    <AppShell>
      <div className="mb-4">
        <Link href="/superadmin/businesses"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Businesses</Button></Link>
      </div>

      <PageHeader title={business.businessName} description={business.description}>
        <Button variant="outline" size="sm"><Link href={`/superadmin/businesses/${business.id}/edit`}>Edit</Link></Button>
        <InviteUserDialog isMutating={isMutating} onSubmit={(body) => runProfileAction(body, 'User invited')} />
        <Button size="sm" onClick={() => router.push(`/superadmin/businesses/${business.id}?tab=subscription`)}>Manage Subscription</Button>
        {isSuspended ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isMutating}
            onClick={() => runProfileAction({ action: 'activate' }, `${business.businessName} unsuspended`)}
          >
            <CheckCircle2 className="h-4 w-4" /> Unsuspend
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" disabled={isMutating} />}><Ban className="h-4 w-4" /> Suspend</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Suspend {business.businessName}?</AlertDialogTitle>
                <AlertDialogDescription>This will block access for all business users and mark the business as suspended.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => runProfileAction({ action: 'suspend' }, `${business.businessName} suspended`)}>
                  Suspend Business
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </PageHeader>

      <Tabs value={selectedTab} onValueChange={(tab) => router.push(`/superadmin/businesses/${business.id}?tab=${tab}`)} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="change-password">Change Password</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">{business.logoPath}</div>
                  <div>
                    <CardTitle className="text-xl">{business.businessName}</CardTitle>
                    <div className="mt-1 flex items-center gap-2"><StatusBadge status={business.status} /><PlanBadge plan={business.plan} /></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProfileLine icon={Users} label="Owner:" value={business.ownerName || 'No owner assigned'} />
                <ProfileLine icon={Mail} value={business.email} />
                <ProfileLine icon={Phone} value={business.phone} />
                <ProfileLine icon={MapPin} value={business.address || business.city || business.country || 'No address set'} />
                <ProfileLine icon={Building} value={business.industry || 'No industry set'} />
                <ProfileLine icon={Calendar} value={`Joined: ${business.createdAt}`} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              {[
                { label: 'Active Users', value: users.filter((user) => user.status === 'active').length, icon: Users, color: 'text-blue-500' },
                { label: 'Active Branches', value: branches.length, icon: Building, color: 'text-purple-500' },
                { label: 'Total Paid', value: `KES ${revenue.paid.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
                { label: 'Plan', value: currentPlan, icon: CreditCard, color: 'text-indigo-500' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-muted', stat.color)}><Icon className="h-5 w-5" /></div>
                        <div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="text-xl font-bold">{stat.value}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="col-span-2">
                <CardHeader><CardTitle className="text-base">Subscription Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <SummaryItem label="Current Plan" value={<PlanBadge plan={currentPlan} />} />
                    <SummaryItem label="Status" value={<StatusBadge status={subscription?.status || business.status} />} />
                    <SummaryItem label="Payment" value={<StatusBadge status={subscription?.paymentStatus || 'pending'} />} />
                    <SummaryItem label="WhatsApp" value={<StatusBadge status={business.whatsappStatus ? 'connected' : 'disconnected'} />} />
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader><CardTitle className="text-base">Payment Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <SummaryAmount label="Total Paid" amount={revenue.paid} className="text-green-600" />
                    <SummaryAmount label="Pending" amount={revenue.pending} className="text-amber-600" />
                    <div><p className="text-sm text-muted-foreground">Invoices</p><p className="text-lg font-bold">{revenue.invoices}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Current Subscription</CardTitle><CardDescription>Plan details and billing information</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox label="Current Plan" value={<PlanBadge plan={currentPlan} />} />
                  <InfoBox label="Status" value={<StatusBadge status={subscription?.status || business.status} />} />
                  <InfoBox label="Monthly Cost" value={`KES ${monthlyCost.toLocaleString()}`} />
                  <InfoBox label="Billing Cycle" value={subscription?.billingCycle ?? billingCycle} />
                  <InfoBox label="Renewal Date" value={formatDate(subscription?.renewalDate)} />
                  <InfoBox label="Auto Renewal" value={subscription?.autoRenewal ? 'Enabled' : 'Disabled'} />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <SubscriptionDialog title="Upgrade Subscription" description={`Move ${business.businessName} to a higher plan and apply the new limits.`} button={<><ArrowUpCircle className="h-4 w-4" /> Upgrade</>} plan={subscriptionPlan} billingCycle={billingCycle} autoRenewal={autoRenewal} isMutating={isMutating} onPlanChange={setSubscriptionPlan} onBillingCycleChange={setBillingCycle} onAutoRenewalChange={setAutoRenewal} onSubmit={(data) => runProfileAction(data, `${business.businessName} subscription updated`)} />
                  <SubscriptionDialog title="Downgrade Subscription" description="Choose a lower plan and confirm how the limit changes should be applied." button={<><ArrowDownCircle className="h-4 w-4" /> Downgrade</>} plan={subscriptionPlan} billingCycle={billingCycle} autoRenewal={autoRenewal} isMutating={isMutating} variant="outline" onPlanChange={setSubscriptionPlan} onBillingCycleChange={setBillingCycle} onAutoRenewalChange={setAutoRenewal} onSubmit={(data) => runProfileAction(data, `${business.businessName} subscription updated`)} />
                  <RenewDialog currentPlan={currentPlan} billingCycle={billingCycle} isMutating={isMutating} onBillingCycleChange={setBillingCycle} onSubmit={(data) => runProfileAction(data, `${business.businessName} subscription renewed`)} />
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button size="sm" variant="destructive" disabled={isMutating} />}>Cancel</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Cancel this subscription?</AlertDialogTitle><AlertDialogDescription>This will stop future renewals for {business.businessName} and mark the business as expired.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => runProfileAction({ action: 'cancelSubscription' }, `${business.businessName} subscription cancelled`)}>Confirm Cancel</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Plan Capacity</CardTitle><CardDescription>Included users and branches</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <Capacity label="User Licenses" used={users.length} total={userCapacity} color="bg-purple-500" />
                <Capacity label="Branches" used={branches.length} total={branchCapacity} color="bg-blue-500" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Payment History</CardTitle><CardDescription>All transactions for this business</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="bg-muted/50"><TableHead>Invoice</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                <TableBody>
                  {payments.length > 0 ? payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.invoice}</TableCell>
                      <TableCell>KES {payment.amount.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={payment.status} /></TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(payment.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.description}</TableCell>
                    </TableRow>
                  )) : <EmptyTable colSpan={6} label="No payments yet" />}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div><CardTitle>Users ({users.length})</CardTitle><CardDescription>Active users in this business</CardDescription></div>
              <InviteUserDialog isMutating={isMutating} onSubmit={(body) => runProfileAction(body, 'User invited')} />
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 rounded-xl border p-4">
                      <Avatar><AvatarFallback className="bg-primary/10 text-primary">{user.avatar}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        <div className="mt-1 flex items-center gap-2"><span className="text-xs font-medium text-muted-foreground">{user.role || 'Team Member'}</span><StatusBadge status={user.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyBlock label="No users have been added to this business yet." />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          {branches.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building className="h-5 w-5" /></div>
                      <div><p className="font-semibold">{branch.name}</p><StatusBadge status={branch.status} /></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <ProfileLine icon={MapPin} value={branch.location} />
                      <ProfileLine icon={Users} value={`Manager: ${branch.manager}`} />
                      <ProfileLine icon={Phone} value={branch.phone || 'No phone set'} />
                      <ProfileLine icon={Building} value={`${branch.stock} stock / reorder ${branch.reorderPoint}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <Card><CardContent className="p-6"><EmptyBlock label="No locations or branches have been added for this business yet." /></CardContent></Card>}
        </TabsContent>

        <TabsContent value="change-password" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Set a new password for a user in this business.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm
                users={users}
                ownerId={business.ownerId}
                isMutating={isMutating}
                onSubmit={(body) => runProfileAction(body, 'Password changed')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Activity Timeline</CardTitle><CardDescription>Chronological events for this business</CardDescription></CardHeader>
            <CardContent>
              {activity.length > 0 ? (
                <div className="relative space-y-6 pl-6">
                  <div className="absolute left-2 top-2 h-full w-px bg-border" />
                  {activity.map((event, index) => (
                    <div key={event.id} className="relative">
                      <div className={cn('absolute -left-[18px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background', index % 3 === 0 ? 'bg-green-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-amber-500')} />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()} - {event.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyBlock label="No activity has been recorded for this business yet." />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function titleCasePlan(plan: string): SubscriptionPlan {
  const normalized = plan.toLowerCase();
  if (normalized === 'starter') return 'Starter';
  if (normalized === 'professional') return 'Professional';
  if (normalized === 'enterprise') return 'Enterprise';
  return 'Trial';
}

function ProfileLine({ icon: Icon, label, value }: { icon: React.ElementType; label?: string; value: React.ReactNode }) {
  return <div className="flex items-center gap-3 text-sm"><Icon className="h-4 w-4 text-muted-foreground" />{label ? <span className="text-muted-foreground">{label}</span> : null}<span className="font-medium">{value}</span></div>;
}

function SummaryItem({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>;
}

function SummaryAmount({ label, amount, className }: { label: string; amount: number; className?: string }) {
  return <div><p className="text-sm text-muted-foreground">{label}</p><p className={cn('text-lg font-bold', className)}>KES {amount.toLocaleString()}</p></div>;
}

function InfoBox({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-lg border p-3"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-semibold capitalize">{value}</p></div>;
}

function Capacity({ label, used, total, color }: { label: string; used: number; total: number; color: string }) {
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{used} / {total}</span></div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', color)} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">{label}</div>;
}

function EmptyTable({ colSpan, label }: { colSpan: number; label: string }) {
  return <TableRow><TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">{label}</TableCell></TableRow>;
}

function InviteUserDialog({ isMutating, onSubmit }: { isMutating: boolean; onSubmit: (body: Record<string, unknown>) => void }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      action: 'inviteUser',
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      roleName: String(formData.get('roleName') ?? 'Team Member'),
      password: String(formData.get('password') ?? ''),
    });
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" disabled={isMutating} />}><UserPlus className="h-4 w-4" /> Invite User</DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader><DialogTitle>Invite User</DialogTitle><DialogDescription>Create a tenant user for this business.</DialogDescription></DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <Field name="firstName" label="First Name" required />
            <Field name="lastName" label="Last Name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Phone" />
            <Field name="roleName" label="Role" defaultValue="Team Member" required />
            <Field name="password" label="Temp Password" type="password" required />
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose><Button type="submit" disabled={isMutating}>Create User</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionDialog({ title, description, button, plan, billingCycle, autoRenewal, isMutating, variant, onPlanChange, onBillingCycleChange, onAutoRenewalChange, onSubmit }: {
  title: string;
  description: string;
  button: React.ReactNode;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  autoRenewal: boolean;
  isMutating: boolean;
  variant?: 'outline';
  onPlanChange: (plan: SubscriptionPlan) => void;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onAutoRenewalChange: (autoRenewal: boolean) => void;
  onSubmit: (body: Record<string, unknown>) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      action: 'subscription',
      plan,
      billingCycle,
      price: Number(formData.get('price') ?? planPrices[plan]),
      renewalDate: String(formData.get('renewalDate') ?? ''),
      expiryDate: String(formData.get('expiryDate') ?? ''),
      autoRenewal,
    });
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant={variant} disabled={isMutating} />}>{button}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={plan} onValueChange={(value) => onPlanChange((value ?? 'Trial') as SubscriptionPlan)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(planPrices).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={(value) => onBillingCycleChange((value ?? 'monthly') as BillingCycle)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quartely">Quarterly</SelectItem><SelectItem value="semi-annual">Semi Annual</SelectItem><SelectItem value="annual">Annual</SelectItem></SelectContent>
              </Select>
            </div>
            <Field name="renewalDate" label="Renewal Date" type="date" />
            <Field name="expiryDate" label="Expiry Date" type="date" />
            <Field name="price" label="Amount" type="number" defaultValue={String(planPrices[plan])} />
            <div className="space-y-2">
              <Label>Auto Renewal</Label>
              <Select value={autoRenewal ? 'yes' : 'no'} onValueChange={(value) => onAutoRenewalChange(value === 'yes')}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Enabled</SelectItem><SelectItem value="no">Disabled</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose><Button type="submit" disabled={isMutating}>Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RenewDialog({ currentPlan, billingCycle, isMutating, onBillingCycleChange, onSubmit }: {
  currentPlan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isMutating: boolean;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onSubmit: (body: Record<string, unknown>) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      action: 'renew',
      renewalDate: String(formData.get('renewalDate') ?? ''),
      expiryDate: String(formData.get('expiryDate') ?? ''),
      billingCycle,
      price: Number(formData.get('price') ?? planPrices[currentPlan]),
    });
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline" disabled={isMutating} />}><RefreshCw className="h-4 w-4" /> Renew</DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader><DialogTitle>Renew Subscription</DialogTitle><DialogDescription>Record a renewal for the current {currentPlan} plan.</DialogDescription></DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <Field name="renewalDate" label="Renewal Start" type="date" required />
            <Field name="expiryDate" label="New Expiry" type="date" required />
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={(value) => onBillingCycleChange((value ?? 'monthly') as BillingCycle)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quartely">Quarterly</SelectItem><SelectItem value="semi-annual">Semi Annual</SelectItem><SelectItem value="annual">Annual</SelectItem></SelectContent>
              </Select>
            </div>
            <Field name="price" label="Amount" type="number" defaultValue={String(planPrices[currentPlan])} required />
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose><Button type="submit" disabled={isMutating}>Confirm Renewal</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordForm({
  users,
  ownerId,
  isMutating,
  onSubmit,
}: {
  users: ProfileUser[];
  ownerId?: string | null;
  isMutating: boolean;
  onSubmit: (body: Record<string, unknown>) => void;
  }) {
  const defaultUserId = ownerId || users[0]?.id || '';
  const [selectedUserId, setSelectedUserId] = React.useState(defaultUserId);
  const selectedUser = users.find((user) => user.id === selectedUserId);

  React.useEffect(() => {
    setSelectedUserId(defaultUserId);
  }, [defaultUserId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    onSubmit({
      action: 'changePassword',
      userId: selectedUserId,
      password,
    });

    event.currentTarget.reset();
  }

  if (users.length === 0) {
    return <EmptyBlock label="No users are available for this business." />;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label>User</Label>
        <Select value={selectedUserId} onValueChange={(value) => setSelectedUserId(value ?? '')}>
          <SelectTrigger className="w-full">
            <span className="truncate text-left">
              {selectedUser ? `${selectedUser.name} - ${selectedUser.email}` : 'Select user'}
            </span>
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} - {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Field name="password" label="New Password" type="password" required />
      <Field name="confirmPassword" label="Confirm Password" type="password" required />
      <div className="flex justify-end md:col-span-2">
        <Button type="submit" disabled={isMutating || !selectedUserId}>
          <KeyRound className="h-4 w-4" /> {isMutating ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </form>
  );
}

function Field({ name, label, type = 'text', defaultValue, required }: { name: string; label: string; type?: string; defaultValue?: string; required?: boolean }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} /></div>;
}
