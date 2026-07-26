import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminInfoTile,
  SuperAdminPageShell,
  SuperAdminSectionTitle,
  SuperAdminStatusPill,
  SuperAdminSurface,
} from "@/features/superadmin/components/SuperAdminUI";

interface BusinessRecord {
  id: string;
  businessName: string;
  legalName: string | null;
  registrationNumber: string;
  taxPin: string;
  email: string;
  phone: string;
  alternativePhone: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  country: string | null;
  currency: string | null;
  timezone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

interface OwnerRecord {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
}

function formatDate(value?: Date | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function ownerName(owner: OwnerRecord) {
  return owner.name || `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "Owner";
}

export default function SubscriptionDetail({
  business,
  owners,
}: {
  business: BusinessRecord;
  owners: OwnerRecord[];
}) {
  const registrationRows = [
    ["Business name", business.businessName],
    ["Legal name", business.legalName || "Not set"],
    ["Registration number", business.registrationNumber],
    ["Tax PIN", business.taxPin],
  ];
  const contactRows = [
    ["Email", business.email],
    ["Phone", business.phone],
    ["Alternate phone", business.alternativePhone || "Not set"],
    ["Address", business.address || "Not set"],
    ["City", business.city || "Not set"],
    ["County", business.county || "Not set"],
  ];
  const localeRows = [
    ["Country", business.country || "Not set"],
    ["Currency", business.currency || "Not set"],
    ["Timezone", business.timezone || "Not set"],
  ];
  return (
    <SuperAdminPageShell>
      <Link
        href="/superadmin/subscriptions"
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to subscriptions
      </Link>

      <SuperAdminHeader
        eyebrow="Tenant record"
        icon={Building2}
        title={business.businessName}
        description="Full tenant information loaded from the database, including registration, locale, lifecycle, and linked owner records."
        actions={[
          { label: "Tenant status", value: business.isActive ? "Active" : "Inactive" },
          { label: "Owners", value: String(owners.length) },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-4">
        <SuperAdminInfoTile label="Status" value={business.isActive ? "Active" : "Inactive"} tone={business.isActive ? "emerald" : "amber"} />
        <SuperAdminInfoTile label="Owners" value={String(owners.length)} />
        <SuperAdminInfoTile label="Currency" value={business.currency || "Not set"} />
        <SuperAdminInfoTile label="WhatsApp" value="Cloud API" detail="Template ready" tone="blue" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-black text-slate-950">{business.businessName}</h2>
                  <SuperAdminStatusPill tone={business.isActive ? "emerald" : "amber"}>
                    {business.isActive ? "Active tenant" : "Inactive tenant"}
                  </SuperAdminStatusPill>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {business.email} - {business.phone}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MiniFact label="Registration" value={business.registrationNumber} />
              <MiniFact label="Tax PIN" value={business.taxPin} />
              <MiniFact label="Country" value={business.country || "Not set"} />
              <MiniFact label="Timezone" value={business.timezone || "Not set"} />
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Configuration readiness
            </div>
            <div className="space-y-3">
              <ReadinessRow label="Tenant profile" ready />
              <ReadinessRow label="Owner access" ready={owners.length > 0} />
              <ReadinessRow label="WhatsApp Cloud API" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SuperAdminSurface className="overflow-hidden">
          <SuperAdminSectionTitle
            icon={ReceiptText}
            title="Business profile"
            description="Core tenant information and registration details."
            action={
              <SuperAdminStatusPill tone={business.isActive ? "emerald" : "amber"}>
                {business.isActive ? "Active tenant" : "Inactive tenant"}
              </SuperAdminStatusPill>
            }
          />
          <div className="grid gap-6 p-5 sm:p-6 2xl:grid-cols-2">
            <InfoGroup compact title="Registration" icon={ReceiptText} rows={registrationRows} />
            <InfoGroup compact title="Contact and location" icon={MapPin} rows={contactRows} />
            <InfoGroup compact title="Locale" icon={Globe2} rows={localeRows} />
            <InfoGroup
              compact
              title="Lifecycle"
              icon={CalendarClock}
              rows={[
                ["Created", formatDate(business.createdAt)],
                ["Updated", formatDate(business.updatedAt)],
              ]}
            />
          </div>
        </SuperAdminSurface>

        <SuperAdminSurface className="overflow-hidden">
          <SuperAdminSectionTitle
            icon={UserCircle2}
            title="Owner records"
            description="Users linked to this tenant."
          />
          <div className="space-y-4 p-5">
            {owners.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No users are linked to this business yet.
              </div>
            ) : (
              owners.map((owner) => (
                <div key={owner.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-950">{ownerName(owner)}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Primary tenant access</p>
                      </div>
                    </div>
                    <SuperAdminStatusPill tone={owner.isActive ? "emerald" : "amber"}>
                      {owner.isActive ? "Active" : "Inactive"}
                    </SuperAdminStatusPill>
                  </div>
                  <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="break-all">{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{owner.phone || "No phone on file"}</span>
                    </div>
                    <p className="text-xs text-slate-400">Created: {formatDate(owner.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SuperAdminSurface>
      </div>

      <SuperAdminSurface className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="p-5 sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-950">WhatsApp Cloud API</h2>
                  <SuperAdminStatusPill tone="blue">Template ready</SuperAdminStatusPill>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Configure tenant messaging, webhook values, message templates, and Cloud API credentials on a dedicated page.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
            <Link
              href={`/superadmin/subscriptions/${business.id}/whatsapp`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 lg:w-auto"
            >
              Open WhatsApp setup
            </Link>
          </div>
        </div>
      </SuperAdminSurface>
    </SuperAdminPageShell>
  );
}

function InfoGroup({
  title,
  icon: Icon,
  rows,
  compact = false,
}: {
  title: string;
  icon: typeof ReceiptText;
  rows: string[][];
  compact?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-950">
        <Icon className="h-4 w-4 text-emerald-700" />
        {title}
      </div>
      <div className={compact ? "grid gap-2" : "grid gap-3 md:grid-cols-2"}>
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[150px_minmax(0,1fr)]">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="break-words text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ReadinessRow({ label, ready = false }: { label: string; ready?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        {ready ? "Ready" : "Pending"}
      </span>
    </div>
  );
}
