import {
  Bell,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import {
  SuperAdminHeader,
  SuperAdminInfoTile,
  SuperAdminPageShell,
  SuperAdminSectionTitle,
  SuperAdminStatusPill,
  SuperAdminSurface,
} from "@/features/superadmin/components/SuperAdminUI";

const settingsGroups = [
  {
    title: "Admin access",
    detail: "Manage superadmin roles, login safeguards, and privileged actions.",
    icon: UserCog,
    status: "Configured",
  },
  {
    title: "Security controls",
    detail: "Review session policies, password rules, and platform access boundaries.",
    icon: LockKeyhole,
    status: "Healthy",
  },
  {
    title: "Notifications",
    detail: "Control alerts for registrations, renewals, failures, and risk signals.",
    icon: Bell,
    status: "Active",
  },
  {
    title: "API keys",
    detail: "Rotate service credentials and review integration access.",
    icon: KeyRound,
    status: "Review",
  },
];

export default function SettingsPage() {
  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={Settings}
        title="Platform settings"
        description="Configure superadmin access, security controls, notifications, and operational preferences."
        actions={[
          { label: "Access mode", value: "Restricted" },
          { label: "Audit state", value: "Enabled" },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-3">
        <SuperAdminInfoTile label="Sessions" value="Protected" detail="Privileged access" tone="emerald" />
        <SuperAdminInfoTile label="Audit trail" value="Enabled" detail="Every action logged" tone="blue" />
        <SuperAdminInfoTile label="Review queue" value="1 item" detail="API key rotation" tone="amber" />
      </section>

      <SuperAdminSurface className="overflow-hidden">
        <SuperAdminSectionTitle
          icon={ShieldCheck}
          title="Settings groups"
          description="Use these controls to keep the platform console secure and predictable."
        />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {settingsGroups.map((group) => {
            const Icon = group.icon;

            return (
              <div key={group.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-950">{group.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{group.detail}</p>
                    </div>
                  </div>
                  <SuperAdminStatusPill tone={group.status === "Review" ? "amber" : "emerald"}>
                    {group.status}
                  </SuperAdminStatusPill>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Console policy ready
                </div>
              </div>
            );
          })}
        </div>
      </SuperAdminSurface>
    </SuperAdminPageShell>
  );
}
