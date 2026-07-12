"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, MessageCircle, Settings, ShieldCheck, UserCog, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { businessProfile, teamUsers } from "@/utils/pos-details-data";
import BillingSection from "./BillingSection";
import BusinessProfileSection from "./BusinessProfileSection";
import EditProfileModal from "./EditProfileModal";
import WhatsAppSection from "./WhatsAppSection";
import type { WhatsappStatus } from "./StatusBadge";

type Profile = typeof businessProfile;

export default function SettingsDetails() {
  const profile = businessProfile;
  const users = teamUsers;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isBillingActive = false;
  const [whatsappStatus, setWhatsappStatus] =
    useState<WhatsappStatus>("checking");
  const [pairingCode, setPairingCode] = useState("");

  function saveProfile(values: Profile) {
    void values;
    setIsProfileOpen(false);
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
            <Settings className="h-8 w-8 text-emerald-600" />
            Settings
          </h1>
          <p className="mt-1 text-slate-500">
            Manage business profile, WhatsApp, roles, and permissions
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SettingsSummary
            icon={ShieldCheck}
            label="Business profile"
            value={profile.name}
            tone="text-emerald-700"
          />
          <SettingsSummary
            icon={MessageCircle}
            label="WhatsApp"
            value={whatsappStatus === "ready" ? "Connected" : "Needs setup"}
            tone="text-blue-700"
          />
          <SettingsSummary
            icon={CreditCard}
            label="Billing"
            value={isBillingActive ? "Active" : "Not active"}
            tone="text-amber-700"
          />
          <SettingsSummary
            icon={Users}
            label="Team users"
            value={`${users.length} assigned`}
            tone="text-purple-700"
          />
        </div>

        <BusinessProfileSection
          profile={profile}
          onEdit={() => setIsProfileOpen(true)}
        />
        <WhatsAppSection
          pairingCode={pairingCode}
          status={whatsappStatus}
          onPair={setPairingCode}
          onStatus={setWhatsappStatus}
        />
        <BillingSection isActive={isBillingActive} />
        <AccessManagementLinks teamCount={users.length} />
      </div>

      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={saveProfile}
        profile={profile}
      />
    </div>
  );
}

function SettingsSummary({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-2 flex items-center gap-2 ${tone}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="truncate font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function AccessManagementLinks({ teamCount }: { teamCount: number }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <SettingsRedirectCard
        href="/admin/settings/roles-permissions"
        icon={ShieldCheck}
        label="Roles & Permissions"
        description="Create roles and control which POS modules each role can access."
        meta="3 roles configured"
        tone="blue"
      />
      <SettingsRedirectCard
        href="/admin/settings/team-role-assignments"
        icon={UserCog}
        label="Team Role Assignments"
        description="Assign team members to the right operational role and review access status."
        meta={`${teamCount} team users assigned`}
        tone="emerald"
      />
    </section>
  );
}

function SettingsRedirectCard({
  href,
  icon: Icon,
  label,
  description,
  meta,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  meta: string;
  tone: "blue" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
      : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white";

  const buttonClass =
    tone === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{label}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-700">{meta}</p>
          </div>
        </div>
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${buttonClass}`}
        >
          Open
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
