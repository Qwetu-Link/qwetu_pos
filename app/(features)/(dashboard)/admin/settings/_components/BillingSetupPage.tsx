import Link from "next/link";
import { ArrowLeft, Building2, CreditCard, ReceiptText } from "lucide-react";
import FormField from "./FormField";
import SectionCard from "./SectionCard";

export default function BillingSetupPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/settings"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Link>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
              <CreditCard className="h-8 w-8 text-amber-600" />
              Configure Billing
            </h1>
            <p className="mt-1 text-slate-500">
              Add billing ownership, invoice details, and payment preferences.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            Billing not active
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Billing Profile
                </h2>
                <p className="text-sm text-slate-500">
                  These details appear on invoices and receipts.
                </p>
              </div>
            </div>

            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Billing Contact"
                name="billingContact"
                placeholder="e.g. Finance Admin"
              />
              <FormField
                label="Billing Email"
                name="billingEmail"
                type="email"
                placeholder="billing@qwetulinks.co.ke"
              />
              <FormField
                label="Tax PIN"
                name="taxPin"
                placeholder="e.g. P051234567A"
              />
              <FormField
                label="Phone"
                name="billingPhone"
                type="tel"
                placeholder="+254 712 345 678"
              />
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Billing Address
                </span>
                <textarea
                  name="billingAddress"
                  rows={3}
                  placeholder="Street, building, city, country"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
                />
              </label>
            </form>
          </SectionCard>

          <SectionCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Activation Steps
                </h2>
                <p className="text-sm text-slate-500">
                  Complete these to activate billing.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Confirm billing contact",
                "Add invoice tax details",
                "Choose payment method",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-amber-600 px-4 py-2.5 font-semibold text-white transition hover:bg-amber-700"
            >
              Save Billing Setup
            </button>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
