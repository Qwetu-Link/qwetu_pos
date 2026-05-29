"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  ReceiptText,
  Save,
} from "lucide-react";
import SectionCard from "./SectionCard";

const billingSchema = z.object({
  billingContact: z.string().trim().min(1, "Billing contact is required"),
  billingEmail: z.email("Enter a valid email address").trim(),
  billingPhone: z.string().trim().min(1, "Phone is required"),
  taxPin: z.string().trim().min(1, "Tax PIN is required"),
  billingAddress: z.string().trim().min(1, "Billing address is required"),
  paymentMethod: z.enum(["card", "mpesa", "bank"]),
  billingCycle: z.enum(["monthly", "annual"]),
});

type BillingForm = z.infer<typeof billingSchema>;

const steps = [
  {
    title: "Billing Contact",
    description: "Confirm who owns billing communication.",
  },
  {
    title: "Invoice Details",
    description: "Add tax and invoice address details.",
  },
  {
    title: "Payment Method",
    description: "Choose how billing will be collected.",
  },
];

export default function BillingSetupPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    trigger,
  } = useForm<BillingForm>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      billingContact: "",
      billingEmail: "",
      billingPhone: "",
      taxPin: "",
      billingAddress: "",
      paymentMethod: "card",
      billingCycle: "monthly",
    },
  });
  const form = useWatch({ control });

  const completedSteps = useMemo(
    () => [
      Boolean(form.billingContact && form.billingEmail && form.billingPhone),
      Boolean(form.taxPin && form.billingAddress),
      Boolean(form.paymentMethod && form.billingCycle),
    ],
    [form],
  );
  const allComplete = completedSteps.every(Boolean);

  async function nextStep() {
    const stepFields: (keyof BillingForm)[][] = [
      ["billingContact", "billingEmail", "billingPhone"],
      ["taxPin", "billingAddress"],
      ["paymentMethod", "billingCycle"],
    ];
    const valid = await trigger(stepFields[activeStep]);
    if (!valid) {
      return;
    }

    setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function saveBillingSetup() {
    if (!allComplete) {
      return;
    }

    localStorage.setItem("qwetu.billing.active", "true");
    setSaved(true);
    router.push("/admin/settings");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/settings"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Link>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
              <CreditCard className="h-8 w-8 text-amber-600" />
              Configure Billing
            </h1>
            <p className="mt-1 text-slate-500">
              Complete each step to activate billing for this POS account.
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              saved
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {saved ? "Billing active" : "Billing not active"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {steps[activeStep].title}
                </h2>
                <p className="text-sm text-slate-500">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit(saveBillingSetup)}
            >
              {activeStep === 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <BillingInput
                    label="Billing Contact"
                    name="billingContact"
                    placeholder="e.g. Finance Admin"
                    error={errors.billingContact?.message}
                    register={register}
                  />
                  <BillingInput
                    label="Billing Email"
                    name="billingEmail"
                    type="email"
                    placeholder="billing@qwetulinks.co.ke"
                    error={errors.billingEmail?.message}
                    register={register}
                  />
                  <BillingInput
                    label="Phone"
                    name="billingPhone"
                    type="tel"
                    placeholder="+254 712 345 678"
                    error={errors.billingPhone?.message}
                    register={register}
                  />
                </div>
              ) : null}

              {activeStep === 1 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <BillingInput
                    label="Tax PIN"
                    name="taxPin"
                    placeholder="e.g. P051234567A"
                    error={errors.taxPin?.message}
                    register={register}
                  />
                  <label className="md:col-span-2">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Billing Address
                    </span>
                    <textarea
                      rows={4}
                      {...register("billingAddress")}
                      placeholder="Street, building, city, country"
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.billingAddress ? (
                      <p className="mt-1 text-xs text-red-500">{errors.billingAddress.message}</p>
                    ) : null}
                  </label>
                </div>
              ) : null}

              {activeStep === 2 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Payment Method
                    </span>
                    <select
                      {...register("paymentMethod")}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="card">Card</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Billing Cycle
                    </span>
                    <select
                      {...register("billingCycle")}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </label>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}
                  disabled={activeStep === 0}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!completedSteps[activeStep]}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!allComplete}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Save className="h-4 w-4" />
                    Save Billing Setup
                  </button>
                )}
              </div>
            </form>
          </SectionCard>

          <SectionCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Activation Steps
                </h2>
                <p className="text-sm text-slate-500">
                  Complete these to activate billing.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const complete = completedSteps[index];
                const current = activeStep === index;

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => {
                      if (index === 0 || completedSteps[index - 1]) {
                        setActiveStep(index);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      current
                        ? "border-amber-200 bg-amber-50"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                        complete
                          ? "bg-emerald-600 text-white"
                          : current
                            ? "bg-amber-600 text-white"
                            : "bg-white text-slate-700"
                      }`}
                    >
                      {complete ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        {step.title}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {complete ? "Complete" : step.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

function BillingInput({
  label,
  name,
  type = "text",
  placeholder,
  error,
  register,
}: {
  label: string;
  name: keyof BillingForm;
  type?: string;
  placeholder: string;
  error?: string;
  register: UseFormRegister<BillingForm>;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
