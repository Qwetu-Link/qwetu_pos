import { Mail, Phone, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import type { Customer } from "@/types/customer";
import { RISK_CONFIG, SEGMENT_CONFIG } from "@/data/customer-config";
import { getInitials, getLoyaltyStatus, getLoyaltyProgress } from "@/lib/customerUtils";

export function CustomerProfilePanel({ customer: c }: { customer: Customer }) {
  const risk = RISK_CONFIG[c.riskLevel];
  const seg = SEGMENT_CONFIG[c.segment];
  const loyalty = getLoyaltyStatus(c.totalSpent);
  const loyaltyPct = getLoyaltyProgress(c.totalSpent);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-inner flex-shrink-0">
            {getInitials(c.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <p className="text-emerald-100 text-sm">{c.segment} Customer</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Contact */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-2 text-slate-600">
            <Mail size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="break-words">{c.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone size={14} className="text-slate-400 flex-shrink-0" />
            <span>{c.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span>{c.address || "Not provided"}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${risk.color}`}>
            <ShieldCheck size={11} /> {risk.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${seg.color}`}>
            <TrendingUp size={11} /> {c.segment}
          </span>
        </div>

        {/* Stats grid */}
        <div className="border-t pt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Total Orders", value: c.totalOrders, bg: "bg-slate-50" },
            { label: "Total Spent",  value: `KES ${c.totalSpent.toLocaleString()}`, bg: "bg-emerald-50 text-emerald-700" },
            { label: "Active Plans", value: c.activeInstallments, bg: "bg-amber-50 text-amber-700" },
            { label: "Last Purchase",value: c.lastPurchase || "—", bg: "bg-slate-50" },
          ].map(({ label, value, bg }) => (
            <div key={label} className={`rounded-xl p-3 ${bg}`}>
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Loyalty bar */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Loyalty Status</span>
            <span className="text-emerald-700 font-bold text-sm">{loyalty}</span>
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${loyaltyPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            KES {c.totalSpent.toLocaleString()} / 150,000
          </p>
        </div>
      </div>
    </div>
  );
}
