"use client";

import {
  createTRPCUntypedClient,
  httpBatchLink,
  type TRPCUntypedClient,
} from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/trpc/routers/_app";
import {
  getQueuedMutations,
  markMutationFailed,
  markMutationSyncing,
  removeQueuedMutation,
} from "./db";

let client: TRPCUntypedClient<AppRouter> | null = null;
let isSyncing = false;

function getClient() {
  client ??= createTRPCUntypedClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: "/api/trpc",
      }),
    ],
  });

  return client;
}

export async function syncOfflineMutations() {
  if (typeof window === "undefined" || !navigator.onLine || isSyncing) {
    return;
  }

  isSyncing = true;

  try {
    const queued = await getQueuedMutations();

    for (const mutation of queued) {
      if (!navigator.onLine) break;

      try {
        await markMutationSyncing(mutation.id);
        await getClient().mutation(mutation.procedure, mutation.input);
        await removeQueuedMutation(mutation.id);
      } catch (error) {
        await markMutationFailed(mutation.id, error);
        break;
      }
    }
  } finally {
    isSyncing = false;
  }
}

export function registerOfflineSync() {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleOnline = () => {
    void syncOfflineMutations();
  };

  const handleQueueChanged = () => {
    if (navigator.onLine) {
      void syncOfflineMutations();
    }
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("qwetu-offline-queue-changed", handleQueueChanged);
  void syncOfflineMutations();

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("qwetu-offline-queue-changed", handleQueueChanged);
  };
}
