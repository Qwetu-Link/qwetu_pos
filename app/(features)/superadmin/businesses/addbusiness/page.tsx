'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Check, CreditCard, MapPin, Save, UserRound } from 'lucide-react';
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
  const [whatsappEnabled, setWhatsappEnabled] = React.useState(false);
  const [autoRenewal, setAutoRenewal] = React.useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success('Business profile created');
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
                <Input id="business-name" placeholder="e.g. Greenleaf Supermarkets" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-code">Business Reg No.</Label>
                <Input id="business-code" placeholder="GRN-001" />
              </div>
              <div className="space-y-2 w-full">
                <Label>Industry</Label>
                <Select required>
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
                <Select defaultValue="trial">
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
                <Input id="tax-id" placeholder="P051234567A" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} placeholder="Short operational summary for internal review" />
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
                <Label htmlFor="owner-name">First Name</Label>
                <Input id="owner-name" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">Last Name</Label>
                <Input id="owner-name" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-email">Email</Label>
                <Input id="owner-email" type="email" placeholder="owner@business.co.ke" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-phone">Phone</Label>
                <Input id="owner-phone" placeholder="+254 700 000 000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temp Password</Label>
                <Input id="password" placeholder="TempPass@123" />
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
                <Input id="country" defaultValue="Kenya" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Nairobi" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Building, street, estate, or town" />
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
                <Select defaultValue="Trial">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="users">Users</Label>
                  <Input id="users" type="number" min="0" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branches">Branches</Label>
                  <Input id="branches" type="number" min="0" defaultValue="1" />
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
                <Button type="submit">
                  <Save className="h-4 w-4" /> Create Business
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
