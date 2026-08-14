"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { queueOfflineMutation, type OfflineMutation } from "@/lib/offline/db";

type OfflineQueuedResult = {
  offlineQueued: true;
  mutation: OfflineMutation;
};

type OfflineMutationConfig = {
  procedure: string;
  label?: string;
};

function isNetworkFailure(error: unknown) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("fetch failed") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("NetworkError") ||
    error.message.includes("Load failed")
  );
}

export function isOfflineQueuedResult(value: unknown): value is OfflineQueuedResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "offlineQueued" in value &&
    (value as OfflineQueuedResult).offlineQueued === true
  );
}

export function useOfflineMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  config: OfflineMutationConfig,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables, mutationContext) => {
      const queue = async () => ({
        offlineQueued: true as const,
        mutation: await queueOfflineMutation({
          procedure: config.procedure,
          input: variables,
          label: config.label,
        }),
      });

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return (await queue()) as TData;
      }

      try {
        if (!options.mutationFn) {
          throw new Error(`Missing mutation function for ${config.procedure}`);
        }

        return await options.mutationFn(variables, mutationContext);
      } catch (error) {
        if (isNetworkFailure(error)) {
          return (await queue()) as TData;
        }

        throw error;
      }
    },
    onSuccess: async (data, variables, onMutateResult, mutationContext) => {
      if (isOfflineQueuedResult(data)) {
        return;
      }

      await options.onSuccess?.(data, variables, onMutateResult, mutationContext);
    },
  });
}
