import { Building2, Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react";

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

export default function SubscriptionDetail({ business, owners }: { business: BusinessRecord; owners: OwnerRecord[] }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Subscription details</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{business.businessName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Full information loaded from the database for this business and its linked user records.
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${business.isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-amber-200 bg-amber-50 text-amber-700"}`}>
            {business.isActive ? "Active tenant" : "Inactive tenant"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Business profile</p>
              <p className="text-sm text-slate-500">Core tenant information</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Business name", business.businessName],
              ["Legal name", business.legalName || "Not set"],
              ["Registration number", business.registrationNumber],
              ["Tax PIN", business.taxPin],
              ["Email", business.email],
              ["Phone", business.phone],
              ["Alternate phone", business.alternativePhone || "Not set"],
              ["Address", business.address || "Not set"],
              ["City", business.city || "Not set"],
              ["County", business.county || "Not set"],
              ["Country", business.country || "Not set"],
              ["Currency", business.currency || "Not set"],
              ["Timezone", business.timezone || "Not set"],
              ["Created", formatDate(business.createdAt)],
              ["Updated", formatDate(business.updatedAt)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Owner records</p>
              <p className="text-sm text-slate-500">Users linked to this business</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {owners.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No users are linked to this business yet.
              </div>
            ) : owners.map((owner) => (
              <div key={owner.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">{owner.name || `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "Owner"}</p>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{owner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{owner.phone || "No phone on file"}</span>
                  </div>
                  <div className="text-xs text-slate-400">Status: {owner.isActive ? "Active" : "Inactive"}</div>
                  <div className="text-xs text-slate-400">Created: {formatDate(owner.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
