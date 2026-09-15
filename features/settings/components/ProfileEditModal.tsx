"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Pencil, Save, X } from "lucide-react";
import { updateCurrentBusinessProfile, type ProfileUpdateState } from "../actions/profile";

export type EditableProfile = {
  businessName: string;
  legalName?: string | null;
  registrationNumber: string;
  taxPin: string;
  email: string;
  phone: string;
  alternativePhone?: string | null;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  country?: string | null;
  currency?: string | null;
  timezone?: string | null;
  logoPath?: string | null;
  description?: string | null;
  industry?: string | null;
  receiptFooter?: string | null;
  invoiceTerms?: string | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerPhone?: string | null;
};

const initialState: ProfileUpdateState = {
  success: false,
};

export default function ProfileEditModal({ profile }: { profile: EditableProfile }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ProfileUpdateState>(initialState);
  const [isPending, startTransition] = useTransition();

  function closeModal() {
    if (isPending) return;
    setIsOpen(false);
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateCurrentBusinessProfile(formData);
      setState(result);

      if (result.success) {
        router.refresh();
        setIsOpen(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-black">Edit Profile</h2>
                <p className="text-sm text-slate-500">Update the business details shown on this page.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                aria-label="Close edit profile modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form action={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5">
              {state.message ? (
                <div
                  className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                    state.success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {state.success ? <CheckCircle2 className="h-4 w-4" /> : null}
                    {state.message}
                  </span>
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <section className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Business Attributes
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <ProfileField
                      label="Business Name"
                      name="businessName"
                      defaultValue={profile.businessName}
                      error={state.errors?.businessName?.[0]}
                      required
                    />
                    <ProfileField
                      label="Legal Name"
                      name="legalName"
                      defaultValue={profile.legalName}
                      error={state.errors?.legalName?.[0]}
                    />
                    <ProfileField
                      label="Registration Number"
                      name="registrationNumber"
                      defaultValue={profile.registrationNumber}
                      error={state.errors?.registrationNumber?.[0]}
                      required
                    />
                    <ProfileField
                      label="Tax PIN"
                      name="taxPin"
                      defaultValue={profile.taxPin}
                      error={state.errors?.taxPin?.[0]}
                      required
                    />
                    <ProfileField
                      label="Business Email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      error={state.errors?.email?.[0]}
                      required
                    />
                    <ProfileField
                      label="Business Phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile.phone}
                      error={state.errors?.phone?.[0]}
                      required
                    />
                    <ProfileField
                      label="Alternative Phone"
                      name="alternativePhone"
                      type="tel"
                      defaultValue={profile.alternativePhone}
                      error={state.errors?.alternativePhone?.[0]}
                    />
                    <ProfileField
                      label="Industry"
                      name="industry"
                      defaultValue={profile.industry}
                      error={state.errors?.industry?.[0]}
                    />
                    <ProfileField
                      label="Address"
                      name="address"
                      defaultValue={profile.address}
                      error={state.errors?.address?.[0]}
                    />
                    <ProfileField
                      label="City"
                      name="city"
                      defaultValue={profile.city}
                      error={state.errors?.city?.[0]}
                    />
                    <ProfileField
                      label="County"
                      name="county"
                      defaultValue={profile.county}
                      error={state.errors?.county?.[0]}
                    />
                    <ProfileField
                      label="Country"
                      name="country"
                      defaultValue={profile.country}
                      error={state.errors?.country?.[0]}
                    />
                    <ProfileField
                      label="Currency"
                      name="currency"
                      defaultValue={profile.currency}
                      error={state.errors?.currency?.[0]}
                    />
                    <ProfileField
                      label="Timezone"
                      name="timezone"
                      defaultValue={profile.timezone}
                      error={state.errors?.timezone?.[0]}
                    />
                    <ProfileField
                      label="Logo URL"
                      name="logoPath"
                      type="url"
                      defaultValue={profile.logoPath}
                      error={state.errors?.logoPath?.[0]}
                    />
                  </div>

                  <div className="mt-4 grid gap-4">
                    <ProfileTextarea
                      label="Description"
                      name="description"
                      defaultValue={profile.description}
                      error={state.errors?.description?.[0]}
                    />
                    <ProfileTextarea
                      label="Receipt Footer"
                      name="receiptFooter"
                      defaultValue={profile.receiptFooter}
                      error={state.errors?.receiptFooter?.[0]}
                    />
                    <ProfileTextarea
                      label="Invoice Terms"
                      name="invoiceTerms"
                      defaultValue={profile.invoiceTerms}
                      error={state.errors?.invoiceTerms?.[0]}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Owner Attributes
                  </h3>
                  <div className="mt-4 grid gap-4">
                    <ProfileField
                      label="Owner Name"
                      name="ownerName"
                      defaultValue={profile.ownerName}
                      error={state.errors?.ownerName?.[0]}
                    />
                    <ProfileField
                      label="Owner Email"
                      name="ownerEmail"
                      type="email"
                      defaultValue={profile.ownerEmail}
                      error={state.errors?.ownerEmail?.[0]}
                    />
                    <ProfileField
                      label="Owner Phone"
                      name="ownerPhone"
                      type="tel"
                      defaultValue={profile.ownerPhone}
                      error={state.errors?.ownerPhone?.[0]}
                    />
                  </div>
                </section>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ProfileTextarea({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: keyof EditableProfile;
  defaultValue?: string | null;
  error?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}

function ProfileField({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof EditableProfile;
  defaultValue?: string | null;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
