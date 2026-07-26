"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Store,
} from "lucide-react";
import { businessProfile, getInitials } from "@/utils/pos-details-data";
import EditProfileModal from "./EditProfileModal";

type Profile = typeof businessProfile;

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<Profile>(businessProfile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function saveProfile(values: Profile) {
    setProfile(values);
    setIsProfileOpen(false);
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/admin/settings"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Link>
              <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
                <Store className="h-8 w-8 text-emerald-600" />
                Business Profile
              </h1>
              <p className="mt-1 text-slate-500">
                View and update the public business details used across the POS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </div>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-extrabold text-white shadow-sm">
                    <Building2 className="absolute h-10 w-10 opacity-20" />
                    {getInitials(profile.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active profile
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Store identity
                      </span>
                    </div>
                    <h2 className="mt-3 break-words text-3xl font-extrabold text-slate-950">
                      {profile.name}
                    </h2>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                      {profile.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <ContactCard icon={Mail} label="Email" value={profile.email} />
                <ContactCard icon={Phone} label="Phone" value={profile.phone} />
                <ContactCard icon={MapPin} label="Location" value={profile.location} />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Business Details</h2>
                    <p className="text-sm text-slate-500">Information used on store documents and communication.</p>
                  </div>
                </div>
                <div className="mt-5 divide-y divide-slate-100">
                  <DetailRow label="Business name" value={profile.name} />
                  <DetailRow label="Business email" value={profile.email} />
                  <DetailRow label="Business phone" value={profile.phone} />
                  <DetailRow label="Location" value={profile.location} />
                  <DetailRow label="Description" value={profile.description} />
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Profile Health</h2>
                <div className="mt-4 space-y-3">
                  <HealthRow label="Business name" complete={Boolean(profile.name)} />
                  <HealthRow label="Email address" complete={Boolean(profile.email)} />
                  <HealthRow label="Phone number" complete={Boolean(profile.phone)} />
                  <HealthRow label="Location" complete={Boolean(profile.location)} />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <h2 className="text-lg font-bold text-emerald-950">Need changes?</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Update the profile once and the same details can be used across receipts, store settings, and communication.
                </p>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Details
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={saveProfile}
        profile={profile}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="break-words text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-emerald-700">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 break-words text-sm font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        complete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        {complete ? "Done" : "Missing"}
      </span>
    </div>
  );
}
