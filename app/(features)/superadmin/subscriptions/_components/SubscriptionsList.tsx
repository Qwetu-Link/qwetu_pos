import Link from "next/link";
import { BadgeCheck, BadgeX, Building2, ChevronRight, Clock3, Layers3, Mail, Phone, Search, Users } from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminPageShell,
  SuperAdminPanel,
  SuperAdminStatusPill,
} from "../../_components/SuperAdminUI";

interface BusinessOwner {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface BusinessRecord {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  owner: BusinessOwner | null;
}

function formatDate(value?: Date | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function ownerName(owner: BusinessOwner) {
  return owner.name || `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "Owner";
}

export default function SubscriptionsList({ records }: { records: BusinessRecord[] }) {
  const activeCount = records.filter((record) => record.isActive).length;
  const inactiveCount = records.length - activeCount;

  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={Layers3}
        title="Business subscriptions"
        description="Review all registered businesses, primary owners, and tenant activation status."
        actions={[
          { label: "Businesses", value: String(records.length) },
          { label: "Active tenants", value: String(activeCount) },
        ]}
      />

      <SuperAdminPanel
        title="Tenant records"
        description="Open a tenant to inspect the full business profile and linked owner records."
        icon={Building2}
        action={
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">
            <Search className="h-4 w-4" />
            Scan tenants
          </div>
        }
      >
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <SummaryTile label="Total tenants" value={String(records.length)} tone="slate" />
          <SummaryTile label="Active" value={String(activeCount)} tone="emerald" />
          <SummaryTile label="Needs review" value={String(inactiveCount)} tone="amber" />
        </div>

        <div className="grid gap-4">
          {records.map((record) => (
            <article key={record.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className={`h-1.5 ${record.isActive ? "bg-emerald-500" : "bg-amber-500"}`} />
              <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    record.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-950">{record.businessName}</h2>
                      {record.isActive ? (
                        <SuperAdminStatusPill>
                          <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                          Active
                        </SuperAdminStatusPill>
                      ) : (
                        <SuperAdminStatusPill tone="amber">
                          <BadgeX className="mr-1 h-3.5 w-3.5" />
                          Inactive
                        </SuperAdminStatusPill>
                      )}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">{record.email}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                        {record.phone}
                      </span>
                      <span className="flex items-center gap-2 sm:col-span-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />
                        Registered {formatDate(record.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:min-w-[300px]">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Users className="h-4 w-4 text-emerald-600" />
                    Primary owner
                  </div>
                  {record.owner ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-semibold text-slate-800">{ownerName(record.owner)}</p>
                      <p className="truncate text-sm text-slate-500">{record.owner.email}</p>
                      <p className="text-sm text-slate-500">{record.owner.phone || "No phone on file"}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">No owner record found</p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
                <Link
                  href={`/superadmin/subscriptions/${record.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View full details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              </div>
            </article>
          ))}
        </div>
      </SuperAdminPanel>
    </SuperAdminPageShell>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "emerald" | "amber";
}) {
  const styles = {
    slate: "border-slate-200 bg-slate-50 text-slate-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
