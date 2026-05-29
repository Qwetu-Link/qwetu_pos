"use client";

import { useMemo, useState } from "react";
import {
  formatCurrency,
  formatDate,
  getNextDueDate,
  getRemainingAmount,
} from "@/data/lipa-mdogo-data";
import type { PaymentPlan } from "@/data/lipa-mdogo-data";

type ReminderModalProps = {
  plan: PaymentPlan | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReminderModal({
  plan,
  isOpen,
  onClose,
}: ReminderModalProps) {
  const [channel, setChannel] = useState("SMS");

  const message = useMemo(() => {
    if (!plan) {
      return "";
    }

    const nextDue = getNextDueDate(plan);
    const dueText = nextDue ? formatDate(nextDue) : "your completed plan";

    return `Hello ${plan.customer}, this is a friendly reminder for your Lipa Mdogo payment of ${formatCurrency(
      plan.installmentAmount,
    )} due on ${dueText}. Outstanding balance: ${formatCurrency(
      getRemainingAmount(plan),
    )}.`;
  }, [plan]);

  if (!isOpen || !plan) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Send Payment Reminder
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {plan.customer} · {plan.invoiceNo}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close reminder modal"
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
                Channel
              </span>
              <select
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option>SMS</option>
                <option>Email</option>
                <option>WhatsApp</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Send to
              </span>
              <input
                readOnly
                value={channel === "Email" ? plan.email : plan.phone}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Reminder message
            </span>
            <textarea
              defaultValue={message}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This prepares the reminder content. Connect this action to your SMS,
            email, or WhatsApp provider when the backend endpoint is ready.
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
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Send Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
