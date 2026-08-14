"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function OfflinePageActions() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const retry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={retry}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isRetrying}
      >
        <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
        {isOnline ? "Reconnect now" : "Try again"}
      </button>
      <Link
        href="/"
        prefetch={false}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
    </div>
  );
}
