'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, Save, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layouts/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Business } from '@/types/admin/business';
import { toast } from 'sonner';

const industries = ['Retail', 'Pharmacy', 'Hotel', 'School', 'Hospital', 'Restaurant', 'Property Management', 'Manufacturing', 'Wholesale', 'Other'];
type BusinessStatus = 'trial' | 'active' | 'suspended' | 'expired';

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [industry, setIndustry] = React.useState('');
  const [status, setStatus] = React.useState<BusinessStatus>('active');

  React.useEffect(() => {
    let isMounted = true;

    async function loadBusiness() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/superadmin/businesses/${businessId}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load business');
        const { data } = await response.json() as { data: { business: Business } };

        if (isMounted) {
          setBusiness(data.business);
          setIndustry(data.business.industry || '');
          setStatus((data.business.status || 'active') as BusinessStatus);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Could not load business');
          setBusiness(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBusiness();
    return () => {
      isMounted = false;
    };
  }, [businessId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/superadmin/businesses/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'editBusiness',
          businessName: String(formData.get('businessName') ?? ''),
          registrationNumber: String(formData.get('registrationNumber') ?? ''),
          taxPin: String(formData.get('taxPin') ?? ''),
          email: String(formData.get('email') ?? ''),
          phone: String(formData.get('phone') ?? ''),
          industry,
          status,
          description: String(formData.get('description') ?? ''),
          ownerName: String(formData.get('ownerName') ?? ''),
          ownerEmail: String(formData.get('ownerEmail') ?? ''),
          ownerPhone: String(formData.get('ownerPhone') ?? ''),
          country: String(formData.get('country') ?? ''),
          city: String(formData.get('city') ?? ''),
          address: String(formData.get('address') ?? ''),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to update business');

      toast.success(`${business.businessName} updated`);
      router.push(`/superadmin/businesses/${business.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update business');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <AppShell><div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading business...</div></AppShell>;
  }

  if (!business) {
    return (
      <AppShell>
        <div className="mb-4">
          <Link href="/superadmin/businesses">
            <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Businesses</Button>
          </Link>
        </div>
        <Card><CardContent className="flex h-40 items-center justify-center text-sm text-muted-foreground">Business not found.</CardContent></Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title={`Edit ${business.businessName}`} description="Update business profile, owner contact, and operating details">
        <Button variant="outline" size="sm">
          <Link href={`/superadmin/businesses/${business.id}`} className="flex items-center"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile</Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
              <div><CardTitle className="text-base">Business Details</CardTitle><CardDescription>Company identity and platform status</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="business-name" name="businessName" label="Business Name" defaultValue={business.businessName} required className="md:col-span-2" />
            <Field id="business-code" name="registrationNumber" label="Business Reg No." defaultValue={business.registrationNumber} required />
            <div className="space-y-2 w-full">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={(value) => setIndustry(value ?? '')}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>{industries.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <Label>Business Status</Label>
              <Select value={status} onValueChange={(value) => setStatus((value ?? 'active') as BusinessStatus)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field id="tax-id" name="taxPin" label="Tax ID" defaultValue={business.taxPin} required />
            <Field id="email" name="email" label="Business Email" type="email" defaultValue={business.email} required />
            <Field id="phone" name="phone" label="Business Phone" defaultValue={business.phone} required />
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={business.description || ''} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><UserRound className="h-5 w-5" /></div>
                <div><CardTitle className="text-base">Owner Contact</CardTitle><CardDescription>Primary admin details</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field id="owner-name" name="ownerName" label="Owner Name" defaultValue={business.ownerName || ''} />
              <Field id="owner-email" name="ownerEmail" label="Owner Email" type="email" defaultValue={business.ownerEmail || ''} />
              <Field id="owner-phone" name="ownerPhone" label="Owner Phone" defaultValue={business.ownerPhone || ''} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
                <div><CardTitle className="text-base">Location</CardTitle><CardDescription>Operating address and region</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field id="country" name="country" label="Country" defaultValue={business.country || 'Kenya'} required />
              <Field id="city" name="city" label="City" defaultValue={business.city || ''} />
              <Field id="address" name="address" label="Address" defaultValue={business.address || ''} />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button"><Link href={`/superadmin/businesses/${business.id}`}>Cancel</Link></Button>
          <Button type="submit" disabled={isSaving}><Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </AppShell>
  );
}

function Field({ id, name, label, type = 'text', defaultValue, required, className }: { id: string; name: string; label: string; type?: string; defaultValue?: string; required?: boolean; className?: string }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}
