import Link from "next/link";
import { BadgeCheck, BadgeX, Building2, ChevronRight, Users } from "lucide-react";

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

export default function SubscriptionsList({ records }: { records: BusinessRecord[] }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Super Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Business subscriptions</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review all registered businesses, their primary owners, and whether each tenant is currently active.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {records.length} businesses
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {records.map((record) => (
          <div key={record.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{record.businessName}</h2>
                    {record.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <BadgeX className="h-3.5 w-3.5" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{record.email}</p>
                  <p className="text-sm text-slate-500">{record.phone}</p>
                </div>
              </div>

              <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Primary owner
                </div>
                {record.owner ? (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {record.owner.name || `${record.owner.firstName ?? ""} ${record.owner.lastName ?? ""}`.trim() || "Owner"}
                    </p>
                    <p className="text-sm text-slate-500">{record.owner.email}</p>
                    <p className="text-sm text-slate-500">{record.owner.phone || "No phone on file"}</p>
                    <p className="text-xs text-slate-400">Owner since {formatDate(record.owner.createdAt)}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No owner record found</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div className="text-sm text-slate-500">Registered {formatDate(record.createdAt)}</div>
              <Link
                href={`/superadmin/subscriptions/${record.id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View full details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
