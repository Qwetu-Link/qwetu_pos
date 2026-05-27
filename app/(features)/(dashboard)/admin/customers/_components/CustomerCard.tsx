import Link from "next/link";
import { Mail, Phone, Pencil, Trash2, ChevronRight } from "lucide-react";
import type { Customer } from "@/types/customer";
import { RISK_CONFIG, SEGMENT_CONFIG } from "@/types/customer";
import { getInitials } from "@/lib/customerUtils";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerCard({ customer: c, onEdit, onDelete }: CustomerCardProps) {
  const risk = RISK_CONFIG[c.riskLevel];
  const seg = SEGMENT_CONFIG[c.segment];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {getInitials(c.name)}
          </div>
          <div>
            <h1 className="font-semibold text-slate-800">{c.name}</h1>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(c)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Edit customer"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(c.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete customer"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-1.5 mb-4 pb-4 border-b border-slate-100 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-slate-400 flex-shrink-0" />
          <span className="truncate">{c.email || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-slate-400 flex-shrink-0" />
          <span>{c.phone}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Orders",       value: c.totalOrders },
          { label: "Spent",        value: `KES ${(c.totalSpent / 1000).toFixed(0)}K` },
          { label: "Active Plans", value: c.activeInstallments },
          {
            label: "Score",
            value: (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-800">{c.paymentScore}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${risk.color}`}>
                  {risk.label}
                </span>
              </div>
            ),
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-black mb-0.5">{label}</p>
            {typeof value === "string" || typeof value === "number" ? (
              <p className="text-lg font-bold text-slate-800">{value}</p>
            ) : value}
          </div>
        ))}
      </div>

      {/* Footer: dates + segment + view link */}
      <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-100">
        <div className="flex gap-3">
          <span>Joined: {new Date(c.joinedDate).toLocaleDateString()}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${seg.color}`}>
          {c.segment}
        </span>
      </div>

      {/* View 360° link */}
      <Link
        href={`/admin/customers/${c.id}`}
        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
      >
        View Customer 360° <ChevronRight size={14} />
      </Link>
    </div>
  );
}
