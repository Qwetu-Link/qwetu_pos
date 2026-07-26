import Link from "next/link";
import { ArrowRight, CreditCard, FileText, ShieldCheck } from "lucide-react";
import SectionCard from "./SectionCard";

export default function BillingSection({
  isActive,
}: {
  isActive: boolean;
}) {
  return (
    <SectionCard>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Billing</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isActive ? "Active" : "Not active"}
              </span>
            </div>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              Configure billing details, subscription ownership, invoices, and
              payment method preferences for the POS account.
            </p>
          </div>
        </div>

        {isActive ? (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" />
            View Invoices
          </button>
        ) : (
          <Link
            href="/admin/settings/billing"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            Configure Billing
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <BillingTile
          icon={ShieldCheck}
          label="Account status"
          value={isActive ? "Billing verified" : "Setup required"}
        />
        <BillingTile
          icon={CreditCard}
          label="Payment method"
          value={isActive ? "Card on file" : "Not configured"}
        />
        <BillingTile
          icon={FileText}
          label="Invoice profile"
          value={isActive ? "Ready" : "Missing tax and contact info"}
        />
      </div>
    </SectionCard>
  );
}

function BillingTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-amber-600" />
        <span>{label}</span>
      </div>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}
