"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CreditCard,
  Mail,
  MessageSquare,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  UserCircle,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NotificationChannelPreferences } from "@/db/queries/notifications";
import type { NotificationType } from "@/db/schema/notifications";
import { teamUsers } from "@/utils/pos-details-data";
import { PushNotificationManager } from "@/hooks/usePushNotifications";
import { updateNotificationPreference } from "@/features/settings/actions/notifications";

type SettingsTab = "payments" | "staff" | "receipt" | "notifications";

const tabs: {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "staff", label: "Staff & Roles", icon: Users },
  { id: "receipt", label: "Receipt & Branding", icon: ReceiptText },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const notificationRows = [
  {
    type: "low_stock_alert",
    title: "Low Stock Alert",
    description: "Triggered when inventory level falls below the threshold/reorder point.",
  },
  {
    type: "expiry_alert",
    title: "Expiry Alert",
    description: "Triggered when a product batch is nearing its expiration date.",
  },
  {
    type: "order_created",
    title: "New Order Alert",
    description: "Triggered when a new order is created.",
  },
  {
    type: "order_paid",
    title: "Payment Alert",
    description: "Triggered when a payment is recorded or requires review.",
  },
] satisfies Array<{
  type: NotificationType;
  title: string;
  description: string;
}>;

export default function SettingsDetails({
  notificationPreferences,
}: {
  notificationPreferences: NotificationChannelPreferences[];
}) {
  const users = teamUsers;
  const [activeTab, setActiveTab] = useState<SettingsTab>("notifications");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
                <Settings className="h-8 w-8 text-emerald-600" />
                Shop Settings
              </h1>
              <p className="mt-1 text-slate-500">
                Manage store preferences, receipts, notifications, staff, and roles.
              </p>
            </div>
            <Link
              href="/admin/settings/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <UserCircle className="h-4 w-4" />
              View Profile
            </Link>
          </div>

          <nav className="mt-7 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "notifications" ? (
          <NotificationsPanel notificationPreferences={notificationPreferences} />
        ) : null}
        {activeTab === "staff" ? <StaffPanel teamCount={users.length} /> : null}
        {activeTab === "receipt" ? <ReceiptBrandingPanel /> : null}
        {activeTab === "payments" ? <PaymentMethodsPanel /> : null}
      </div>
    </main>
  );
}

function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: { label: string; icon: LucideIcon };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-semibold transition ${
        isActive
          ? "border-emerald-600 text-emerald-700"
          : "border-transparent text-slate-500 hover:text-emerald-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      {tab.label}
    </button>
  );
}

function NotificationsPanel({
  notificationPreferences,
}: {
  notificationPreferences: NotificationChannelPreferences[];
}) {
  const [preferences, setPreferences] = useState(notificationPreferences);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const preferenceMap = new Map(preferences.map((item) => [item.type, item]));

  async function handleChannelChange(
    type: NotificationType,
    channel: "inApp" | "email" | "sms",
    checked: boolean,
  ) {
    const current = preferenceMap.get(type) ?? {
      type,
      inApp: true,
      email: false,
      sms: false,
    };
    const next = { ...current, [channel]: checked };
    const key = `${type}-${channel}`;

    setSavingKey(key);
    setPreferences((items) => items.map((item) => item.type === type ? next : item));

    const result = await updateNotificationPreference(next);

    if (result.success && result.preferences) {
      setPreferences(result.preferences);
    } else {
      setPreferences(preferences);
    }

    setSavingKey(null);
  }

  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-3xl font-extrabold text-black">Notification Settings</h2>
        <p className="mt-2 text-slate-500">
          Configure how and where shop-wide notifications and alerts are delivered.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <h3 className="text-base font-bold text-slate-950">Store-Wide Broadcast Settings</h3>
          <p className="mt-1 text-sm text-slate-500">
            In-app alerts stay enabled for operational visibility.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {notificationRows.map((row) => (
            <NotificationRow
              key={row.type}
              row={row}
              preference={preferenceMap.get(row.type)}
              savingKey={savingKey}
              onChannelChange={handleChannelChange}
            />
          ))}
        </div>
      </div>

      <PushNotificationManager />
    </section>
  );
}

function NotificationRow({
  row,
  preference,
  savingKey,
  onChannelChange,
}: {
  row: {
    type: NotificationType;
    title: string;
    description: string;
  };
  preference?: NotificationChannelPreferences;
  savingKey: string | null;
  onChannelChange: (
    type: NotificationType,
    channel: "inApp" | "email" | "sms",
    checked: boolean,
  ) => void;
}) {
  const channels = preference ?? {
    type: row.type,
    inApp: true,
    email: false,
    sms: false,
  };

  return (
    <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_340px] lg:items-center">
      <div>
        <h4 className="text-sm font-bold text-slate-950">{row.title}</h4>
        <p className="mt-2 text-sm text-slate-500">{row.description}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ChannelToggle
          icon={Bell}
          label="In-App"
          checked={channels.inApp}
          disabled={savingKey === `${row.type}-inApp`}
          onChange={(checked) => onChannelChange(row.type, "inApp", checked)}
        />
        <ChannelToggle
          icon={Mail}
          label="Email"
          checked={channels.email}
          disabled={savingKey === `${row.type}-email`}
          onChange={(checked) => onChannelChange(row.type, "email", checked)}
        />
        <ChannelToggle
          icon={MessageSquare}
          label="SMS"
          checked={channels.sms}
          disabled={savingKey === `${row.type}-sms`}
          onChange={(checked) => onChannelChange(row.type, "sms", checked)}
        />
      </div>
    </div>
  );
}

function ChannelToggle({
  icon: Icon,
  label,
  checked,
  disabled,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`flex flex-col gap-2 text-xs font-medium text-slate-500 ${disabled ? "opacity-60" : ""}`}>
      <span className="inline-flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-emerald-600" : "bg-slate-200"}`}>
        <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "translate-x-5" : ""}`} />
      </span>
    </label>
  );
}

function StaffPanel({ teamCount }: { teamCount: number }) {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-3xl font-extrabold text-black">Staff & Roles</h2>
        <p className="mt-2 text-slate-500">
          Manage role permissions and team assignments.
        </p>
      </div>

      <AccessManagementLinks teamCount={teamCount} />
    </section>
  );
}

function ReceiptBrandingPanel() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-3xl font-extrabold text-black">Receipt & Branding</h2>
        <p className="mt-2 text-slate-500">
          Review business identity details used across receipts and store documents.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Business Profile</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Store name, contact details, logo, receipt footer, and invoice terms.
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Open
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PaymentMethodsPanel() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-3xl font-extrabold text-black">Payment Methods</h2>
        <p className="mt-2 text-slate-500">
          Review payment collection areas available in the dashboard.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsRedirectCard
          href="/admin/payments"
          icon={CreditCard}
          label="Payments"
          description="Open payment records and collection activity."
          meta="Payment workspace"
          tone="emerald"
        />
        <SettingsRedirectCard
          href="/admin/payments/invoices"
          icon={ReceiptText}
          label="Invoices"
          description="Open invoice records and payment references."
          meta="Invoice workspace"
          tone="blue"
        />
      </div>
    </section>
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
        meta="Role access"
        tone="blue"
      />
      <SettingsRedirectCard
        href="/admin/settings/team-role-assignments"
        icon={UserCog}
        label="Team Role Assignments"
        description="Assign team members to operational roles and review access status."
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
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{label}</h3>
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
