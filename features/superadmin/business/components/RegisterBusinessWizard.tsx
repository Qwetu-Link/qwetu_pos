"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Building2,
  ChevronRight,
  ClipboardCheck,
  LockKeyhole,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { superAdminCreateBusiness } from "@/server/register-business";
import {
  SuperAdminHeader,
  SuperAdminInfoTile,
  SuperAdminPageShell,
  SuperAdminSectionTitle,
  SuperAdminSurface,
} from "@/features/superadmin/components/SuperAdminUI";

interface FormState {
  businessName: string;
  registrationNumber: string;
  taxPin: string;
  businessEmail: string;
  phone: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  password: string;
}

const initialFormState: FormState = {
  businessName: "",
  registrationNumber: "",
  taxPin: "",
  businessEmail: "",
  phone: "",
  ownerFirstName: "",
  ownerLastName: "",
  ownerEmail: "",
  password: "",
};

export default function RegisterBusinessWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isStepOneValid = useMemo(() => {
    return (
      form.businessName.trim().length >= 2 &&
      form.registrationNumber.trim().length >= 1 &&
      form.taxPin.trim().length >= 1 &&
      form.businessEmail.includes("@") &&
      form.phone.trim().length >= 5
    );
  }, [form]);

  const isStepTwoValid = useMemo(() => {
    return (
      form.ownerFirstName.trim().length >= 2 &&
      form.ownerLastName.trim().length >= 2 &&
      form.ownerEmail.includes("@") &&
      form.password.trim().length >= 6
    );
  }, [form]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await superAdminCreateBusiness(form);
        if (result.success) {
          setMessage(`Business registered successfully. Owner ${form.ownerEmail} was created.`);
          setForm(initialFormState);
          setStep(1);
          return;
        }

        setError("Registration failed. Please confirm the details and try again.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed.");
      }
    });
  };

  const steps = [
    {
      title: "Business workspace",
      detail: "Legal, tax, and contact details",
      active: step === 1,
      done: step > 1,
      icon: Building2,
    },
    {
      title: "Owner access",
      detail: "Primary account credentials",
      active: step === 2,
      done: false,
      icon: LockKeyhole,
    },
  ];

  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={Building2}
        title="Register business"
        description="Create a tenant workspace, owner credentials, and platform access record from one controlled superadmin flow."
        actions={[
          { label: "Progress", value: `Step ${step} of 2` },
          { label: "Workspace", value: form.businessName || "Draft" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <SuperAdminSurface className="overflow-hidden">
            <SuperAdminSectionTitle
              icon={ClipboardCheck}
              title="Workspace checklist"
              description="Complete both stages before creating the tenant."
            />
            <div className="space-y-3 p-5">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`rounded-xl border px-4 py-3 ${
                      item.active
                        ? "border-emerald-200 bg-emerald-100 text-emerald-950"
                        : item.done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                          : "border-slate-200 bg-white text-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          item.active
                            ? "bg-emerald-600 text-white"
                            : item.done
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.done ? <ShieldCheck className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.title}</p>
                        <p className={`mt-0.5 text-xs ${item.active ? "text-emerald-700" : "text-slate-500"}`}>
                          Step {index + 1} - {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SuperAdminSurface>

          <div className="grid gap-3">
            <SuperAdminInfoTile label="Validation" value={step === 1 ? "Business" : "Owner"} detail="Current stage" tone="blue" />
            <SuperAdminInfoTile label="Access type" value="Owner" detail="Tenant administrator" tone="emerald" />
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                {step === 1 ? <Building2 className="h-5 w-5" /> : <UserCircle2 className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">
                  {step === 1 ? "Business workspace" : "Owner account"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {step === 1
                    ? "Capture tenant registration and contact details."
                    : "Create the first privileged user for this tenant."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {message ? (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Business name" value={form.businessName} onChange={(value) => handleChange("businessName", value)} placeholder="Acme Retail" />
                  <Field label="Registration number" value={form.registrationNumber} onChange={(value) => handleChange("registrationNumber", value)} placeholder="REG-001" />
                  <Field label="Tax PIN" value={form.taxPin} onChange={(value) => handleChange("taxPin", value)} placeholder="A000000000" />
                  <Field label="Business email" type="email" value={form.businessEmail} onChange={(value) => handleChange("businessEmail", value)} placeholder="contact@acme.co" />
                </div>
                <Field label="Phone number" value={form.phone} onChange={(value) => handleChange("phone", value)} placeholder="254700000000" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="First name" value={form.ownerFirstName} onChange={(value) => handleChange("ownerFirstName", value)} placeholder="Jane" />
                <Field label="Last name" value={form.ownerLastName} onChange={(value) => handleChange("ownerLastName", value)} placeholder="Doe" />
                <Field label="Owner email" type="email" value={form.ownerEmail} onChange={(value) => handleChange("ownerEmail", value)} placeholder="owner@acme.co" />
                <Field label="Temporary password" type="password" value={form.password} onChange={(value) => handleChange("password", value)} placeholder="At least 6 characters" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((prev) => prev - 1);
              }}
              disabled={step === 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(2);
                }}
                disabled={!isStepOneValid}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepTwoValid || pending}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {pending ? "Registering..." : "Register business"}
                <ShieldCheck className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </SuperAdminPageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-600"
        placeholder={placeholder}
      />
    </label>
  );
}
