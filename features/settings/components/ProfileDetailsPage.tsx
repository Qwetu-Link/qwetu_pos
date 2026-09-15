import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { getBusinessProfileById } from "@/db/queries/business";
import ProfileEditModal from "./ProfileEditModal";

type BusinessProfileData = NonNullable<Awaited<ReturnType<typeof getBusinessProfileById>>>;

type DetailItem = {
  icon: typeof Mail;
  label: string;
  value?: string | number | null;
};

type SummaryItem = {
  icon: typeof UsersRound;
  label: string;
  value: string;
  tone: string;
};

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  currency: "KES",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatCurrency(value?: number | null) {
  return currencyFormatter.format(value ?? 0).replace("Ksh", "KES");
}

function formatDate(value?: Date | string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatLabel(value?: string | null) {
  if (!value) return null;

  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(value?: string | null) {
  return (value ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileDetailsPage({ profile }: { profile: BusinessProfileData }) {
  const { business, subscription, revenue } = profile;
  const businessName = business.businessName;
  const ownerName = business.ownerName;
  const location = [business.address, business.city, business.county, business.country]
    .filter(Boolean)
    .join(", ");
  const plan = subscription?.plan ?? formatLabel(business.plan);
  const status = formatLabel(business.status);
  const paymentStatus = formatLabel(subscription?.paymentStatus);
  const joinedDate = formatDate(business.createdAt);
  const profileDetails: DetailItem[] = [
    { icon: UserRound, label: "Owner", value: ownerName },
    { icon: Mail, label: "Email", value: business.email },
    { icon: Phone, label: "Phone", value: business.phone },
    { icon: MapPin, label: "Location", value: location },
    { icon: Store, label: "Industry", value: business.industry },
    { icon: ReceiptText, label: "Joined", value: joinedDate },
  ].filter((item) => item.value);

  const summaryItems: SummaryItem[] = [
    {
      icon: UsersRound,
      label: "Active Users",
      value: String(business.users),
      tone: "text-blue-600",
    },
    {
      icon: Building2,
      label: "Active Branches",
      value: String(business.branches),
      tone: "text-purple-600",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: formatCurrency(revenue.paid),
      tone: "text-emerald-600",
    },
    {
      icon: CreditCard,
      label: "Plan",
      value: plan ?? "",
      tone: "text-indigo-600",
    },
  ].filter((item) => item.value);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>

        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="flex min-h-[420px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <div className="flex items-start gap-4">
                <BusinessMark logoPath={business.logoPath} name={businessName} />
                <div className="min-w-0">
                  <h1 className="break-words text-xl font-semibold text-black">
                    {businessName}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {status ? <StatusPill tone="green">{status}</StatusPill> : null}
                    {plan ? <StatusPill tone="blue">{plan}</StatusPill> : null}
                  </div>
                </div>
              </div>

              {profileDetails.length > 0 ? (
                <div className="mt-5 space-y-3.5">
                  {profileDetails.map((item) => (
                    <ProfileLine
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      value={String(item.value)}
                    />
                  ))}
                </div>
              ) : null}

              {business.description ? (
                <p className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  {business.description}
                </p>
              ) : null}
            </div>

            <ProfileEditModal
              profile={{
                businessName: business.businessName,
                legalName: business.legalName,
                registrationNumber: business.registrationNumber,
                taxPin: business.taxPin,
                email: business.email,
                phone: business.phone,
                alternativePhone: business.alternativePhone,
                address: business.address,
                city: business.city,
                county: business.county,
                country: business.country,
                currency: business.currency,
                timezone: business.timezone,
                logoPath: business.logoPath,
                description: business.description,
                industry: business.industry,
                receiptFooter: business.receiptFooter,
                invoiceTerms: business.invoiceTerms,
                ownerName: business.ownerName,
                ownerEmail: business.ownerEmail,
                ownerPhone: business.ownerPhone,
              }}
            />
          </aside>

          <div className="space-y-4">
            <section className="grid gap-4 md:grid-cols-2">
              {summaryItems.map((item) => (
                <SummaryCard key={item.label} item={item} />
              ))}
            </section>

            {(plan || status || paymentStatus || typeof business.whatsappStatus === "boolean") ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-medium text-black">Subscription Summary</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {plan ? <SummaryMetric label="Current Plan" value={plan} tone="blue" /> : null}
                  {status ? <SummaryMetric label="Status" value={status} tone="green" /> : null}
                  {paymentStatus ? <SummaryMetric label="Payment" value={paymentStatus} tone="amber" /> : null}
                  <SummaryMetric
                    label="WhatsApp"
                    value={business.whatsappStatus ? "Connected" : "Disconnected"}
                    tone={business.whatsappStatus ? "green" : "slate"}
                  />
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-medium text-black">Payment Summary</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <PaymentMetric label="Total Paid" value={formatCurrency(revenue.paid)} tone="text-emerald-600" />
                <PaymentMetric label="Pending" value={formatCurrency(revenue.pending)} tone="text-orange-500" />
                <PaymentMetric label="Invoices" value={String(revenue.invoices)} tone="text-black" />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function BusinessMark({ logoPath, name }: { logoPath?: string | null; name: string }) {
  if (logoPath) {
    return (
      <div
        aria-label={`${name} logo`}
        className="h-16 w-16 shrink-0 rounded-2xl bg-slate-100 object-cover"
        role="img"
        style={{
          backgroundImage: `url(${logoPath})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-xl font-bold text-black">
      {getInitials(name)}
    </div>
  );
}

function ProfileLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[20px_64px_1fr] items-center gap-2.5 text-black">
      <Icon className="h-4 w-4 text-slate-500" />
      <span className="text-sm text-slate-600">{label}:</span>
      <span className="min-w-0 break-words text-sm">{value}</span>
    </div>
  );
}

function SummaryCard({ item }: { item: SummaryItem }) {
  const Icon = item.icon;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon className={`h-6 w-6 ${item.tone}`} />
        </span>
        <div>
          <p className="text-sm text-slate-600">{item.label}</p>
          <p className="mt-1 break-words text-xl font-semibold text-black">{item.value}</p>
        </div>
      </div>
    </article>
  );
}

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "blue" | "green" | "slate";
}) {
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <StatusPill tone={tone}>{value}</StatusPill>
    </div>
  );
}

function PaymentMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "amber" | "blue" | "green" | "slate";
}) {
  const toneClass = {
    amber: "bg-amber-100 text-orange-600",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  }[tone];

  return (
    <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${toneClass}`}>
      {tone === "green" ? <CheckCircle2 className="h-3 w-3" /> : null}
      {tone === "blue" ? <BadgeCheck className="h-3 w-3" /> : null}
      {children}
    </span>
  );
}
