import Link from "next/link";
import {
  BadgeCheck,
  BadgeX,
  Building2,
  ChevronRight,
  Clock3,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminInfoTile,
  SuperAdminPageShell,
  SuperAdminSectionTitle,
  SuperAdminStatusPill,
  SuperAdminSurface,
} from "@/features/superadmin/components/SuperAdminUI";

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
        icon={Building2}
        title="Tenant subscriptions"
        description="Operate across every registered business, owner account, and tenant activation state."
        actions={[
          { label: "Businesses", value: String(records.length) },
          { label: "Active tenants", value: String(activeCount) },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-3">
        <SuperAdminInfoTile label="Total tenants" value={String(records.length)} detail="Registered workspaces" />
        <SuperAdminInfoTile label="Active" value={String(activeCount)} detail="Ready for operations" tone="emerald" />
        <SuperAdminInfoTile label="Needs review" value={String(inactiveCount)} detail="Inactive or incomplete" tone={inactiveCount > 0 ? "amber" : "slate"} />
      </section>

      <SuperAdminSurface className="overflow-hidden">
        <SuperAdminSectionTitle
          icon={Search}
          title="Tenant directory"
          description="Scan business records, owners, activation, and registration timing."
          action={
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">
              <Search className="h-4 w-4" />
              {records.length} records
            </div>
          }
        />

        <div className="divide-y divide-slate-100">
          {records.map((record) => (
            <article key={record.id} className="grid gap-4 p-4 transition hover:bg-slate-50 sm:p-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.7fr)_auto] xl:items-center">
              <div className="flex min-w-0 gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    record.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-black text-slate-950">{record.businessName}</h2>
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
                  <div className="mt-3 grid gap-2 text-sm text-slate-500 lg:grid-cols-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{record.email}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      {record.phone}
                    </span>
                    <span className="flex items-center gap-2 lg:col-span-2">
                      <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />
                      Registered {formatDate(record.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
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

              <Link
                href={`/superadmin/subscriptions/${record.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </SuperAdminSurface>
    </SuperAdminPageShell>
  );
}
