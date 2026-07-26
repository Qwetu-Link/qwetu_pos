import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Gauge,
  MessageCircle,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";

const platformMetrics = [
  {
    label: "Monthly recurring revenue",
    value: "KES 4.8M",
    change: "+12.4%",
    detail: "Subscription revenue across live tenants",
    icon: CircleDollarSign,
    tone: "emerald",
  },
  {
    label: "Active tenants",
    value: "24",
    change: "+3",
    detail: "Operational business workspaces",
    icon: Building2,
    tone: "blue",
  },
  {
    label: "Collection health",
    value: "98%",
    change: "+4.1%",
    detail: "Paid or confirmed renewals",
    icon: CreditCard,
    tone: "violet",
  },
  {
    label: "Risk items",
    value: "3",
    change: "-2",
    detail: "Requires admin decision",
    icon: ShieldAlert,
    tone: "amber",
  },
];

const healthRows = [
  { tenant: "Qwetu Retail", plan: "Enterprise", score: 96, status: "Healthy", mrr: "KES 240K" },
  { tenant: "Urban Threads", plan: "Growth", score: 88, status: "Stable", mrr: "KES 120K" },
  { tenant: "Mavazi Hub", plan: "Starter", score: 73, status: "Watch", mrr: "KES 48K" },
  { tenant: "Style Point", plan: "Starter", score: 61, status: "Review", mrr: "KES 36K" },
];

const timeline = [
  { title: "Subscription renewal due", detail: "Qwetu Retail renewal is due today", time: "08:40", status: "Action" },
  { title: "Business registered", detail: "3 new tenant workspaces created", time: "10:15", status: "Stable" },
  { title: "WhatsApp setup pending", detail: "2 Cloud API templates need credentials", time: "11:20", status: "Review" },
  { title: "Owner verification", detail: "2 owner accounts waiting activation", time: "13:05", status: "Action" },
];

const actions = [
  { label: "Register tenant", detail: "Create workspace and owner account", href: "/superadmin/business", icon: Plus },
  { label: "Tenant directory", detail: "Review subscription and owner records", href: "/superadmin/subscriptions", icon: Search },
  { label: "Platform reports", detail: "Open revenue, activation, and risk views", href: "/superadmin/reports", icon: TrendingUp },
];

const channelReadiness = [
  ["WhatsApp Cloud API", "2 pending", "amber"],
  ["Email receipts", "Ready", "emerald"],
  ["Payment reminders", "Template", "blue"],
  ["Webhook delivery", "Prepared", "slate"],
] as const;

const revenueBars = [44, 52, 61, 58, 74, 69, 82, 88, 93, 89, 96, 100];

export default function SuperAdminDashboard() {
  return (
    <main className="mx-auto w-full max-w-[1540px] space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
                  Superadmin overview
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Platform operations
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Monitor tenant health, subscription revenue, onboarding risk, and messaging readiness from one executive console.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone="emerald">System healthy</StatusPill>
                <StatusPill tone="blue">Global access</StatusPill>
                <StatusPill tone="slate">Audit enabled</StatusPill>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)]">
            <div className="p-5 sm:p-6">
              <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-5 text-slate-950 sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Revenue run-rate
                    </p>
                    <p className="mt-2 text-4xl font-black">KES 5.2M</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Forecasted recurring revenue if active tenants renew.
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-7 flex h-36 items-end gap-2">
                  {revenueBars.map((height, index) => (
                    <div key={index} className="flex flex-1 items-end rounded-t-lg bg-emerald-100">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-lime-300"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-5 lg:border-l lg:border-t-0 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-950">Today’s focus</p>
                  <p className="mt-1 text-sm text-slate-500">High-leverage admin work</p>
                </div>
                <Gauge className="h-5 w-5 text-emerald-700" />
              </div>
              <div className="space-y-3">
                <FocusRow label="Renewals due" value="3" tone="amber" />
                <FocusRow label="Tenant onboarding" value="92%" tone="emerald" />
                <FocusRow label="Owner activation" value="87%" tone="blue" />
                <FocusRow label="Cloud API pending" value="2" tone="slate" />
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-5 text-slate-950 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                Command rail
              </p>
              <h2 className="mt-2 text-2xl font-black">Fast actions</h2>
            </div>
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="mt-6 space-y-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black">{action.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{action.detail}</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-emerald-700" />
                </Link>
              );
            })}
          </div>
        </section>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
        <Panel
          icon={Building2}
          title="Tenant health board"
          description="Ranked workspace readiness using billing, owner activity, and configuration signals."
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[minmax(180px,1fr)_120px_110px_100px] gap-4 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-400">
              <span>Tenant</span>
              <span>Plan</span>
              <span>MRR</span>
              <span className="text-right">Score</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {healthRows.map((row) => (
                <div
                  key={row.tenant}
                  className="grid grid-cols-[minmax(180px,1fr)_120px_110px_100px] items-center gap-4 px-4 py-4 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{row.tenant}</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          row.score < 70 ? "bg-amber-500" : row.score < 80 ? "bg-blue-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-slate-600">{row.plan}</span>
                  <span className="font-black text-slate-950">{row.mrr}</span>
                  <div className="text-right">
                    <p className="font-black text-slate-950">{row.score}%</p>
                    <p className="mt-1 text-xs text-slate-500">{row.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          icon={BellRing}
          title="Activity and alerts"
          description="Recent signals that can become admin work."
        >
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                  </div>
                  <StatusPill tone={item.status === "Stable" ? "emerald" : item.status === "Review" ? "amber" : "blue"}>
                    {item.status}
                  </StatusPill>
                </div>
                <p className="mt-3 text-xs font-bold text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_380px]">
        <Panel icon={MessageCircle} title="Messaging readiness" description="Tenant communication channels and setup state.">
          <div className="grid gap-3 sm:grid-cols-2">
            {channelReadiness.map(([label, value, tone]) => (
              <SignalTile key={label} label={label} value={value} tone={tone} />
            ))}
          </div>
        </Panel>

        <Panel icon={UserRoundCheck} title="Onboarding pipeline" description="Where tenants are in activation.">
          <div className="grid gap-3 sm:grid-cols-3">
            <PipelineStep label="Registered" value="24" tone="emerald" />
            <PipelineStep label="Owner active" value="21" tone="blue" />
            <PipelineStep label="Configured" value="18" tone="slate" />
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-950">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Activation benchmark
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tenants with owner access, billing profile, and communication templates configured are counted as fully activated.
            </p>
          </div>
        </Panel>

        <Panel icon={Clock3} title="Renewal window" description="Next billing decisions.">
          <div className="space-y-3">
            {[
              ["Qwetu Retail", "KES 45,000", "Today"],
              ["Urban Threads", "KES 30,000", "2 days"],
              ["Mavazi Hub", "KES 18,500", "5 days"],
            ].map(([tenant, amount, due]) => (
              <div key={tenant} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-black text-slate-950">{tenant}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-emerald-700">{amount}</span>
                  <span className="text-xs font-bold text-slate-500">{due}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "emerald" | "blue" | "slate" | "amber";
  children: React.ReactNode;
}) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black ${classes[tone]}`}>
      {children}
    </span>
  );
}

function FocusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "blue" | "slate" | "amber";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <StatusPill tone={tone}>{value}</StatusPill>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
}) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
  }[tone] ?? "bg-slate-100 text-slate-700";

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">
          {change}
        </span>
      </div>
      <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SignalTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "blue" | "slate";
}) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  };

  return (
    <div className={`rounded-2xl border p-4 ${classes[tone]}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function PipelineStep({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "blue" | "slate";
}) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  };

  return (
    <div className={`rounded-2xl border p-4 ${classes[tone]}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
