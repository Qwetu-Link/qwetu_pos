"use client";

import { useEffect, useState } from "react";
import { getOfflineMutationCount } from "@/lib/offline/db";
import { registerOfflineSync } from "@/lib/offline/sync";

export default function OfflineSyncProvider() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const refresh = () => {
      setIsOnline(navigator.onLine);
      void getOfflineMutationCount().then(setPendingCount);
    };

    const unregisterSync = registerOfflineSync();

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener("qwetu-offline-queue-changed", refresh);

    return () => {
      unregisterSync();
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener("qwetu-offline-queue-changed", refresh);
    };
  }, []);

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950 shadow-sm">
      {isOnline
        ? `Syncing ${pendingCount} offline change${pendingCount === 1 ? "" : "s"}...`
        : `You're offline. ${pendingCount} change${pendingCount === 1 ? "" : "s"} will sync when you reconnect.`}
    </div>
  );
}
