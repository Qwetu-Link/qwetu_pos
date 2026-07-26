import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Building2,
  KeyRound,
  MessageCircle,
  Save,
  Send,
  ShieldCheck,
  Smartphone,
  Webhook,
} from "lucide-react";
import {
  SuperAdminInfoTile,
  SuperAdminPageShell,
  SuperAdminStatusPill,
} from "@/features/superadmin/components/SuperAdminUI";

interface BusinessRecord {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

const setupSteps = [
  ["Business App", "Create Meta app and connect WhatsApp product"],
  ["Phone Number", "Assign a verified WhatsApp sender"],
  ["Webhook", "Configure callback URL and verify token"],
  ["Templates", "Approve message templates for reminders and receipts"],
];

const templateRows = [
  ["Payment reminder", "payment_reminder", "Utility", "Installment reminders before due date"],
  ["Receipt sent", "receipt_sent", "Utility", "Receipt confirmation after successful payment"],
  ["Installment overdue", "installment_overdue", "Utility", "Collections alert for late installments"],
];

export default function WhatsAppCloudApiConfigPage({
  business,
}: {
  business: BusinessRecord;
}) {
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://your-domain.com"}/api/whatsapp/${business.id}/webhook`;

  return (
    <SuperAdminPageShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href={`/superadmin/subscriptions/${business.id}`}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tenant details
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                WhatsApp Cloud API
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Messaging configuration
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Configure Cloud API readiness for {business.businessName}. Credentials are presented as a template until encrypted backend persistence is connected.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-400"
          >
            <Send className="h-4 w-4" />
            Test later
          </button>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-slate-300 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            Save after backend
          </button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <SuperAdminInfoTile label="Tenant status" value={business.isActive ? "Active" : "Inactive"} tone={business.isActive ? "emerald" : "amber"} />
        <SuperAdminInfoTile label="Business phone" value={business.phone} />
        <SuperAdminInfoTile label="Cloud API" value="Not saved" detail="Awaiting backend" tone="amber" />
        <SuperAdminInfoTile label="Webhook" value="Prepared" detail="Callback URL ready" tone="blue" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={KeyRound}
              title="Cloud API credentials"
              description="Store real secrets server-side when persistence is implemented."
            />
            <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
              <ConfigField label="Tenant ID" value={business.id} readOnly />
              <ConfigField label="Display phone number" placeholder="e.g. 254700000000" icon={Smartphone} />
              <ConfigField label="WhatsApp Business Account ID" placeholder="e.g. 123456789012345" />
              <ConfigField label="Phone Number ID" placeholder="e.g. 987654321098765" />
              <ConfigField label="Permanent access token" placeholder="Paste server-side token reference" secure />
              <ConfigField label="App secret" placeholder="Paste encrypted secret reference" secure />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Webhook}
              title="Webhook callback"
              description="Use these values in Meta Developer Console for tenant event delivery."
            />
            <div className="grid gap-4 p-5 sm:p-6">
              <ConfigField label="Callback URL" value={webhookUrl} readOnly />
              <ConfigField label="Verify token" placeholder="Generate tenant verify token" />
              <ConfigField label="Webhook events" value="messages, message_template_status_update, phone_number_name_update" readOnly />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={BellRing}
              title="Message templates"
              description="Starter templates for the flows this tenant will need."
            />
            <div className="divide-y divide-slate-100">
              {templateRows.map(([label, name, category, detail]) => (
                <div
                  key={name}
                  className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                >
                  <div>
                    <p className="font-black text-slate-950">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
                    <p className="mt-2 font-mono text-xs text-slate-400">{name}</p>
                  </div>
                  <SuperAdminStatusPill tone="slate">{category}</SuperAdminStatusPill>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-emerald-50 p-5 text-slate-950">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-emerald-700" />
                <div>
                  <h2 className="text-base font-black">{business.businessName}</h2>
                  <p className="mt-1 text-sm text-slate-500">Tenant contact profile</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <ContextRow label="Email" value={business.email} />
              <ContextRow label="Phone" value={business.phone} />
              <ContextRow label="Status" value={business.isActive ? "Active" : "Inactive"} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-950">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Setup progress
            </div>
            <div className="space-y-3">
              {setupSteps.map(([label, detail], index) => (
                <div key={label} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ConfigField label="Test recipient" placeholder="e.g. 254711222333" />
            <button
              type="button"
              disabled
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-300 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Send className="h-4 w-4" />
              Send test after backend is connected
            </button>
          </section>
        </aside>
      </section>
    </SuperAdminPageShell>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-base font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-all font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ConfigField({
  label,
  value,
  placeholder,
  readOnly = false,
  secure = false,
  icon: Icon,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  secure?: boolean;
  icon?: typeof Smartphone;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
        {label}
      </span>
      <input
        type={secure ? "password" : "text"}
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          readOnly ? "bg-slate-50" : "bg-white focus:border-emerald-600"
        }`}
      />
    </label>
  );
}
