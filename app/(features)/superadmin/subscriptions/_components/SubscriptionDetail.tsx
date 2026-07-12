import Link from "next/link";
import { ArrowLeft, Building2, CalendarClock, Globe2, Mail, MapPin, Phone, ReceiptText, ShieldCheck, UserCircle2 } from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminPageShell,
  SuperAdminPanel,
  SuperAdminStatusPill,
} from "../../_components/SuperAdminUI";

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

export default function SubscriptionDetail({ business, owners }: { business: BusinessRecord; owners: OwnerRecord[] }) {
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
  const lifecycleRows = [
    ["Created", formatDate(business.createdAt)],
    ["Updated", formatDate(business.updatedAt)],
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
        eyebrow="Subscription details"
        icon={Building2}
        title={business.businessName}
        description="Full information loaded from the database for this business and its linked user records."
        actions={[
          { label: "Tenant status", value: business.isActive ? "Active" : "Inactive" },
          { label: "Owners", value: String(owners.length) },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-4">
        <DetailSummary label="Status" value={business.isActive ? "Active" : "Inactive"} tone={business.isActive ? "emerald" : "amber"} />
        <DetailSummary label="Owners" value={String(owners.length)} tone="slate" />
        <DetailSummary label="Currency" value={business.currency || "Not set"} tone="slate" />
        <DetailSummary label="Created" value={formatDate(business.createdAt)} tone="slate" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SuperAdminPanel
          title="Business profile"
          description="Core tenant information and registration details."
          icon={Building2}
          action={
            <SuperAdminStatusPill tone={business.isActive ? "emerald" : "amber"}>
              {business.isActive ? "Active tenant" : "Inactive tenant"}
            </SuperAdminStatusPill>
          }
        >
          <div className="space-y-5">
            <InfoGroup title="Registration" icon={ReceiptText} rows={registrationRows} />
            <InfoGroup title="Contact and location" icon={MapPin} rows={contactRows} />
            <InfoGroup title="Locale" icon={Globe2} rows={localeRows} />
            <InfoGroup title="Lifecycle" icon={CalendarClock} rows={lifecycleRows} />
          </div>
        </SuperAdminPanel>

        <SuperAdminPanel
          title="Owner records"
          description="Users linked to this business."
          icon={UserCircle2}
        >
          <div className="space-y-4">
            {owners.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No users are linked to this business yet.
              </div>
            ) : (
              owners.map((owner) => (
                <div key={owner.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm font-bold text-slate-950">{ownerName(owner)}</p>
                    </div>
                    <SuperAdminStatusPill tone={owner.isActive ? "emerald" : "amber"}>
                      {owner.isActive ? "Active" : "Inactive"}
                    </SuperAdminStatusPill>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
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
        </SuperAdminPanel>
      </div>
    </SuperAdminPageShell>
  );
}

function DetailSummary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "emerald" | "amber";
}) {
  const styles = {
    slate: "border-slate-200 bg-white text-slate-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-950",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
  };

  return (
    <div className={`min-w-0 rounded-xl border px-4 py-3 shadow-sm ${styles[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 truncate text-sm font-black">{value}</p>
    </div>
  );
}

function InfoGroup({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof ReceiptText;
  rows: string[][];
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
        <Icon className="h-4 w-4 text-emerald-700" />
        {title}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
