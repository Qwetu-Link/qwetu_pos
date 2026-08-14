import type { Metadata } from "next";
import {
  CloudOff,
  Database,
  PackageCheck,
  ShoppingBag,
  WifiOff,
} from "lucide-react";
import OfflinePageActions from "@/components/pwa/offline-page-actions";

export const metadata: Metadata = {
  title: "Offline | QwetuLinks",
  description: "QwetuLinks offline fallback page.",
};

export default function OfflinePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101820] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,#101820_0%,#17212B_48%,#0F172A_100%)]" />
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-sm font-medium text-amber-100">
            <WifiOff className="h-4 w-4" />
            Offline mode
          </div>

          <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-6xl">
            You are offline, but your work is still with you.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            QwetuLinks could not reach the network. Cached pages, saved records,
            and queued updates will be ready again as soon as the connection
            returns.
          </p>

          <div className="mt-8">
            <OfflinePageActions />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <OfflineHint
              icon={Database}
              label="Local queue"
              value="Changes sync later"
            />
            <OfflineHint
              icon={PackageCheck}
              label="Cached assets"
              value="App shell available"
            />
            <OfflineHint
              icon={ShoppingBag}
              label="POS ready"
              value="Resume quickly"
            />
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          <div className="absolute inset-6 rounded-full border border-emerald-300/20 [animation:pulse_3s_ease-in-out_infinite]" />
          <div className="absolute inset-14 rounded-full border border-blue-300/20 [animation:pulse_3s_ease-in-out_0.6s_infinite]" />
          <div className="relative w-full rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">QwetuLinks POS</p>
                  <p className="text-xs text-slate-400">Connection interrupted</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-200">
                  <CloudOff className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4 py-6">
                <SignalRow label="Inventory cache" width="w-4/5" tone="bg-emerald-400" />
                <SignalRow label="Order drafts" width="w-3/5" tone="bg-amber-300" />
                <SignalRow label="Sync channel" width="w-2/5" tone="bg-sky-300" />
              </div>

              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                  </span>
                  <p className="text-sm font-medium text-emerald-100">
                    Waiting for network recovery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function OfflineHint({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
      <Icon className="mb-3 h-5 w-5 text-emerald-200" />
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{value}</p>
    </div>
  );
}

function SignalRow({
  label,
  width,
  tone,
}: {
  label: string;
  width: string;
  tone: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>stored</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${width} ${tone} [animation:pulse_2.4s_ease-in-out_infinite]`} />
      </div>
    </div>
  );
}
