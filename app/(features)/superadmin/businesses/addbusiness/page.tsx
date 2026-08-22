'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Check, CreditCard, Eye, EyeOff, MapPin, Save, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layouts/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { superAdminCreateBusiness } from '@/server/register-business';
import type { SuperAdminCreateBusinessInput } from '@/server/register-business';

const industries = [
  'Retail',
  'Pharmacy',
  'Hotel',
  'School',
  'Hospital',
  'Restaurant',
  'Property Management',
  'Manufacturing',
  'Wholesale',
  'Other',
];

export default function AddBusinessPage() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [industry, setIndustry] = React.useState('');
  const [status, setStatus] = React.useState<SuperAdminCreateBusinessInput['status']>('trial');
  const [plan, setPlan] = React.useState<SuperAdminCreateBusinessInput['plan']>('trial');
  const [whatsappEnabled, setWhatsappEnabled] = React.useState(false);
  const [autoRenewal, setAutoRenewal] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await superAdminCreateBusiness({
          businessName: String(formData.get('businessName') ?? ''),
          registrationNumber: String(formData.get('registrationNumber') ?? ''),
          taxPin: String(formData.get('taxPin') ?? 'N/A'),
          email: String(formData.get('email') ?? ''),
          phone: String(formData.get('phone') ?? ''),
          industry,
          status,
          description: String(formData.get('description') ?? ''),
          ownerFirstName: String(formData.get('ownerFirstName') ?? ''),
          ownerLastName: String(formData.get('ownerLastName') ?? ''),
          ownerEmail: String(formData.get('ownerEmail') ?? ''),
          ownerPhone: String(formData.get('ownerPhone') ?? ''),
          password: String(formData.get('password') ?? ''),
          country: String(formData.get('country') ?? 'Kenya'),
          city: String(formData.get('city') ?? ''),
          address: String(formData.get('address') ?? ''),
          plan,
          users: Number(formData.get('users') ?? 1),
          branches: Number(formData.get('branches') ?? 1),
          whatsappStatus: whatsappEnabled,
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success('Business profile created');
        router.push(`/superadmin/businesses/${result.businessId}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create business');
      }
    });
  };

  return (
    <AppShell>
      <PageHeader title="Add Business" description="Create a new business profile and assign its starting plan">
        <Button variant="outline" size="sm">
          <Link href="/superadmin/businesses" className='flex items-center'>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Business Details</CardTitle>
                  <CardDescription>Core company identity and classification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" name="businessName" placeholder="e.g. Greenleaf Supermarkets" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-code">Business Reg No.</Label>
                <Input id="business-code" name="registrationNumber" placeholder="GRN-001" required />
              </div>
              <div className="space-y-2 w-full">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={(value) => setIndustry(value ?? '')} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <Label>Business Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as SuperAdminCreateBusinessInput['status'])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID</Label>
                <Input id="tax-id" name="taxPin" placeholder="P051234567A" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Business Email</Label>
                <Input id="business-email" name="email" type="email" placeholder="info@business.co.ke" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-phone">Business Phone</Label>
                <Input id="business-phone" name="phone" placeholder="+254 700 000 000" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} placeholder="Short operational summary for internal review" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Owner Contact</CardTitle>
                  <CardDescription>Primary administrator and billing contact</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="owner-first-name">First Name</Label>
                <Input id="owner-first-name" name="ownerFirstName" placeholder="First name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-last-name">Last Name</Label>
                <Input id="owner-last-name" name="ownerLastName" placeholder="Last name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-email">Email</Label>
                <Input id="owner-email" name="ownerEmail" type="email" placeholder="owner@business.co.ke" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-phone">Phone</Label>
                <Input id="owner-phone" name="ownerPhone" placeholder="+254 700 000 000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temp Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="TempPass@123"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Location</CardTitle>
                  <CardDescription>Business address and operating region</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue="Kenya" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="Nairobi" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Building, street, estate, or town" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Plan Setup</CardTitle>
                  <CardDescription>Limits, billing, and integrations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 w-full">
                <Label>Subscription Plan</Label>
                <Select value={plan} onValueChange={(value) => setPlan(value as SuperAdminCreateBusinessInput['plan'])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="users">Users</Label>
                  <Input id="users" name="users" type="number" min="0" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branches">Branches</Label>
                  <Input id="branches" name="branches" type="number" min="0" defaultValue="1" />
                </div>
              </div>
              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-renewal">Auto Renewal</Label>
                  <p className="text-xs text-muted-foreground">Renew subscription automatically</p>
                </div>
                <Switch id="auto-renewal" checked={autoRenewal} onCheckedChange={setAutoRenewal} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">Enable WhatsApp onboarding</p>
                </div>
                <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
              </div>

              <Separator />

              <div className="rounded-md border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Check className="h-4 w-4 text-green-500" />
                  Creation checklist
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>Business profile will be created as an internal admin record.</p>
                  <p>Owner receives onboarding credentials after approval.</p>
                  <p>Billing setup can be adjusted from subscriptions.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isPending}>
                  <Save className="h-4 w-4" /> {isPending ? 'Creating...' : 'Create Business'}
                </Button>
                <Button type="button" variant="outline">
                  <Link href="/superadmin/businesses">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </AppShell>
  );
}
