"use client";

import type { FormEvent } from "react";
import { CreditCard, MessageCircle, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { businessProfile, teamUsers } from "@/lib/pos-details-data";
import type { TeamUser } from "@/lib/pos-details-data";
import AddRoleModal from "./AddRoleModal";
import AddTeamUserModal from "./AddTeamUserModal";
import BillingSection from "./BillingSection";
import BusinessProfileSection from "./BusinessProfileSection";
import EditProfileModal from "./EditProfileModal";
import RolesPermissionsSection from "./RolesPermissionsSection";
import TeamAssignmentsSection from "./TeamAssignmentsSection";
import WhatsAppSection from "./WhatsAppSection";
import type { WhatsappStatus } from "./StatusBadge";

type Profile = typeof businessProfile;

export default function SettingsDetails() {
  const [profile, setProfile] = useState<Profile>(businessProfile);
  const [users, setUsers] = useState<TeamUser[]>(teamUsers);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isBillingActive] = useState(false);
  const [whatsappStatus, setWhatsappStatus] =
    useState<WhatsappStatus>("checking");
  const [pairingCode, setPairingCode] = useState("");

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setProfile({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      description: String(formData.get("description") || ""),
    });
    setIsProfileOpen(false);
  }

  function addUser(user: TeamUser) {
    setUsers((currentUsers) => [user, ...currentUsers]);
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
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
        <RolesPermissionsSection onAddRole={() => setIsRoleOpen(true)} />
        <TeamAssignmentsSection
          users={users}
          onAddUser={() => setIsUserOpen(true)}
        />
      </div>

      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={saveProfile}
        profile={profile}
      />
      <AddRoleModal
        isOpen={isRoleOpen}
        onClose={() => setIsRoleOpen(false)}
      />
      <AddTeamUserModal
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        onAddUser={addUser}
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
