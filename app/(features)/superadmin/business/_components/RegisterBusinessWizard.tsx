"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronRight, Building2, UserCircle2, ShieldCheck } from "lucide-react";
import { superAdminCreateBusiness } from "@/server/register-business";
import { SuperAdminHeader, SuperAdminPageShell, SuperAdminPanel } from "../../_components/SuperAdminUI";

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

  const handleNext = () => {
    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
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

  return (
    <SuperAdminPageShell>
      <SuperAdminHeader
        icon={Building2}
        title="Register a new business"
        description="Create a tenant workspace and its owner account in a guided flow."
        actions={[{ label: "Progress", value: `Step ${step} of 2` }]}
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <SuperAdminPanel
          title="Registration checklist"
          description="Complete the required details below."
          icon={Building2}
        >

          <div className="mt-6 space-y-3">
            {[
              { title: "Business details", active: step === 1, done: step > 1 },
              { title: "Owner credentials", active: step === 2, done: step > 2 },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border px-4 py-3 ${
                  item.active
                    ? "border-emerald-200 bg-emerald-50"
                    : item.done
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      item.active || item.done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.done ? "✓" : "•"}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminPanel>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {message ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Business details
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Business name</span>
                  <input
                    value={form.businessName}
                    onChange={(event) => handleChange("businessName", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="Acme Retail"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Registration number</span>
                  <input
                    value={form.registrationNumber}
                    onChange={(event) => handleChange("registrationNumber", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="REG-001"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Tax PIN</span>
                  <input
                    value={form.taxPin}
                    onChange={(event) => handleChange("taxPin", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="A000000000"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Business email</span>
                  <input
                    type="email"
                    value={form.businessEmail}
                    onChange={(event) => handleChange("businessEmail", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="contact@acme.co"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Phone number</span>
                <input
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                  placeholder="254700000000"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <UserCircle2 className="h-4 w-4 text-emerald-600" />
                Owner account
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">First name</span>
                  <input
                    value={form.ownerFirstName}
                    onChange={(event) => handleChange("ownerFirstName", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="Jane"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Last name</span>
                  <input
                    value={form.ownerLastName}
                    onChange={(event) => handleChange("ownerLastName", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="Doe"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Owner email</span>
                  <input
                    type="email"
                    value={form.ownerEmail}
                    onChange={(event) => handleChange("ownerEmail", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="owner@acme.co"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Temporary password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => handleChange("password", event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-emerald-500"
                    placeholder="At least 6 characters"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepOneValid}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepTwoValid || pending}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
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
