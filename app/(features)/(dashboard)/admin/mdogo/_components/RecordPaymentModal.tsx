"use client";

import { useMemo, useState } from "react";
import {
  formatCurrency,
  getRemainingAmount,
} from "@/data/lipa-mdogo-data";
import type { PaymentPlan } from "@/data/lipa-mdogo-data";

type RecordPaymentModalProps = {
  plan: PaymentPlan | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function RecordPaymentModal({
  plan,
  isOpen,
  onClose,
}: RecordPaymentModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultAmount = useMemo(() => {
    if (!plan) {
      return "";
    }

    return String(Math.min(plan.installmentAmount, getRemainingAmount(plan)));
  }, [plan]);

  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");

  if (!isOpen || !plan) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Record Payment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {plan.customer} · Outstanding{" "}
                {formatCurrency(getRemainingAmount(plan))}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close payment modal"
            >
              x
            </button>
          </div>
        </div>

        <form
          className="space-y-5 px-6 py-5"
          onSubmit={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Amount paid
              </span>
              <input
                type="number"
                min="1"
                max={getRemainingAmount(plan)}
                defaultValue={defaultAmount}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Payment date
              </span>
              <input
                type="date"
                defaultValue={today}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Payment method
              </span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option>M-Pesa</option>
                <option>Airtel Money</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Card</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Reference number
              </span>
              <input
                placeholder={paymentMethod === "Cash" ? "Receipt number" : "Transaction ref"}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Note</span>
            <textarea
              rows={3}
              placeholder="Optional payment note"
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Recording is staged in the UI. Hook this form to your payment API to
            create receipts and update balances.
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
