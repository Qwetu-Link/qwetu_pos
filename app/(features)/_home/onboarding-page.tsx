"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function FinOnboardingPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/finance-erp");
  };

  return (
    // Clean, crisp light background matching your overview page structure
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 py-12 text-slate-900 overflow-hidden">
      {/* Reintroduced the subtle brand radial gradient background to keep the depth uniform */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#ecfdf5_40%,_#ffffff_100%)] z-0" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-emerald-100/40 transition-all">
        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Brand Accent Icon Box - Replaced generic secondary/primary with Emerald tokens */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Welcome to Qwetu<span className="text-emerald-600">Links</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Financial Management System
          </p>
        </div>

        {/* Features List */}
        <div className="mb-8 space-y-6">
          {[
            {
              title: "Track Your Cash Flow",
              desc: "Monitor all money in and out of your business",
            },
            {
              title: "Manage Accounts",
              desc: "Track who owes you and who you owe money to",
            },
            {
              title: "View Reports",
              desc: "Get insights into your business finances anytime",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              {/* Step badging uses the signature high-contrast light emerald / dark emerald style */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 font-bold text-emerald-700 text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button - Explicitly overrides theme defaults to use your core primary emerald colors */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full bg-emerald-600 font-bold tracking-wide text-white transition hover:bg-emerald-700 rounded-xl py-6 shadow-sm"
        >
          Proceed to Financial Manager
        </Button>

        {/* Info footer with a clean system-ready check badge alignment style */}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 tracking-normal">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          This onboarding configuration will not appear again
        </p>
      </div>
    </div>
  );
}
