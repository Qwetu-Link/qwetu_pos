"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

const DB_NAME = "qwetu-pos-offline";
const DB_VERSION = 1;

export type OfflineMutationStatus = "pending" | "syncing" | "failed";

export type OfflineMutation = {
  id: string;
  procedure: string;
  input: unknown;
  label?: string;
  status: OfflineMutationStatus;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  lastError?: string;
};

export type OfflineQuerySnapshot<TData = unknown> = {
  key: string;
  data: TData;
  updatedAt: string;
};

interface QwetuOfflineDB extends DBSchema {
  mutations: {
    key: string;
    value: OfflineMutation;
    indexes: {
      "by-status": OfflineMutationStatus;
      "by-created-at": string;
    };
  };
  queries: {
    key: string;
    value: OfflineQuerySnapshot;
  };
}

let dbPromise: Promise<IDBPDatabase<QwetuOfflineDB>> | null = null;

function getOfflineDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser.");
  }

  dbPromise ??= openDB<QwetuOfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("mutations")) {
        const mutationStore = db.createObjectStore("mutations", {
          keyPath: "id",
        });
        mutationStore.createIndex("by-status", "status");
        mutationStore.createIndex("by-created-at", "createdAt");
      }

      if (!db.objectStoreNames.contains("queries")) {
        db.createObjectStore("queries", {
          keyPath: "key",
        });
      }
    },
  });

  return dbPromise;
}

function now() {
  return new Date().toISOString();
}

function createId() {
  return crypto.randomUUID();
}

export async function queueOfflineMutation(
  mutation: Pick<OfflineMutation, "procedure" | "input" | "label">,
) {
  const queued: OfflineMutation = {
    id: createId(),
    procedure: mutation.procedure,
    input: mutation.input,
    label: mutation.label,
    status: "pending",
    attempts: 0,
    createdAt: now(),
    updatedAt: now(),
  };

  await (await getOfflineDB()).put("mutations", queued);
  window.dispatchEvent(new CustomEvent("qwetu-offline-queue-changed"));
  return queued;
}

export async function getQueuedMutations() {
  const db = await getOfflineDB();
  const pending = await db.getAllFromIndex("mutations", "by-status", "pending");
  const failed = await db.getAllFromIndex("mutations", "by-status", "failed");

  return [...pending, ...failed].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

export async function getOfflineMutationCount() {
  return (await getQueuedMutations()).length;
}

export async function markMutationSyncing(id: string) {
  const db = await getOfflineDB();
  const mutation = await db.get("mutations", id);

  if (!mutation) return;

  await db.put("mutations", {
    ...mutation,
    status: "syncing",
    attempts: mutation.attempts + 1,
    updatedAt: now(),
  });
}

export async function markMutationFailed(id: string, error: unknown) {
  const db = await getOfflineDB();
  const mutation = await db.get("mutations", id);

  if (!mutation) return;

  await db.put("mutations", {
    ...mutation,
    status: "failed",
    lastError: error instanceof Error ? error.message : "Sync failed",
    updatedAt: now(),
  });
  window.dispatchEvent(new CustomEvent("qwetu-offline-queue-changed"));
}

export async function removeQueuedMutation(id: string) {
  await (await getOfflineDB()).delete("mutations", id);
  window.dispatchEvent(new CustomEvent("qwetu-offline-queue-changed"));
}

export async function saveQuerySnapshot<TData>(key: string, data: TData) {
  await (await getOfflineDB()).put("queries", {
    key,
    data,
    updatedAt: now(),
  });
}

export async function getQuerySnapshot<TData = unknown>(key: string) {
  return (await getOfflineDB()).get("queries", key) as Promise<
    OfflineQuerySnapshot<TData> | undefined
  >;
}
