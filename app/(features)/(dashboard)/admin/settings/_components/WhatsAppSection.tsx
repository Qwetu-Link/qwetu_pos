import { LogOut, MessageCircle, RefreshCw, Smartphone } from "lucide-react";
import SectionCard from "./SectionCard";
import StatusBadge from "./StatusBadge";
import type { WhatsappStatus } from "./StatusBadge";

export default function WhatsAppSection({
  pairingCode,
  status,
  onPair,
  onStatus,
}: {
  pairingCode: string;
  status: WhatsappStatus;
  onPair: (code: string) => void;
  onStatus: (status: WhatsappStatus) => void;
}) {
  return (
    <SectionCard>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                WhatsApp Connection
              </h2>
              <p className="text-sm text-slate-500">
                Connect a WhatsApp account for reminders, notifications, and
                messages
              </p>
            </div>
          </div>

          <StatusBadge status={status} />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onStatus("ready")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => onStatus("offline")}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="mb-1 font-semibold text-slate-800">
              Pair with phone number
            </h3>
            <p className="mb-3 text-sm text-slate-500">
              Use this when the QR is hard to scan from a mobile screen.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="tel"
                placeholder="e.g. 0712345678"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => onPair("4821 9064")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-white transition hover:bg-slate-900"
              >
                <Smartphone className="h-4 w-4" />
                Get Code
              </button>
            </div>
            {pairingCode ? (
              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Pairing code
                </p>
                <div className="mt-1 font-mono text-3xl font-bold tracking-[0.18em] text-slate-900">
                  {pairingCode}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Open WhatsApp, choose Linked devices, then link with phone
                  number.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full lg:w-56">
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-500">
            {status === "ready" ? (
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600">
                  OK
                </div>
                <p className="font-semibold text-slate-800">
                  Ready to send reminders
                </p>
                <p className="mt-1 text-sm">
                  This device is paired with WhatsApp Web.
                </p>
              </div>
            ) : (
              <div>
                <div className="mx-auto mb-3 h-28 w-28 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="grid h-full grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className={`rounded ${index % 2 === 0 ? "bg-slate-900" : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm">Waiting for WhatsApp bridge...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
