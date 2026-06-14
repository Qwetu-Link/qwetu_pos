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
    /* BACKGROUND LAYER:
       Switched entirely to a solid block of your mid-tone blue: #1A2846 (Steel Navy)
    */
    <div className="relative flex min-h-screen items-center justify-center bg-[#1A2846] px-4 py-12 overflow-hidden">
      
      {/* SURFACE CARD:
         Uses #0C0F1D (Midnight Blue) to sit perfectly on top of the lighter blue background,
         with a clean border separating them.
      */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#42688C]/30 bg-[#0C0F1D] p-8 shadow-2xl shadow-[#050724]/40 transition-all">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Brand Accent Icon Box - Uses the light blue color as a subtle base */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#42688C]/20 text-[#E2F4DF] border border-[#42688C]/40">
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
          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome to Qwetu<span className="text-[#42688C]">Links</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-[#42688C]">
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
              {/* Step badging uses the light blue background with crisp white text */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#42688C]/30 border border-[#42688C]/50 font-bold text-white text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-100 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#42688C] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTON:
           Solid background using your Light Blue (#42688C).
           Text flips to #050724 (or white) to ensure proper accessibility contrast.
        */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full bg-[#42688C] font-bold tracking-wide text-[#050724] transition-all duration-200 hover:bg-[#42688C]/80 rounded-xl py-6 shadow-md active:scale-[0.99]"
        >
          Proceed to Financial Manager
        </Button>
      </div>
    </div>
  );
}