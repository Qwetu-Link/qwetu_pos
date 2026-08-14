"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { queueOfflineMutation, type OfflineMutation } from "@/lib/offline/db";

type OfflineQueuedResult = {
  offlineQueued: true;
  mutation: OfflineMutation;
};

type OfflineMutationConfig = {
  procedure: string;
  label?: string;
  successMessage?: string;
  queuedMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showQueuedToast?: boolean;
  showErrorToast?: boolean;
};

function getActionLabel(config: OfflineMutationConfig) {
  return config.label ?? "Action";
}

function getErrorMessage(error: unknown, config: OfflineMutationConfig) {
  if (config.errorMessage) {
    return config.errorMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `${getActionLabel(config)} failed. Please try again.`;
}

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
      const queue = async () => {
        const mutation = await queueOfflineMutation({
          procedure: config.procedure,
          input: variables,
          label: config.label,
        });

        if (config.showQueuedToast !== false) {
          toast.info(
            config.queuedMessage ??
              `${getActionLabel(config)} saved offline. It will sync when you're back online.`,
          );
        }

        return {
          offlineQueued: true as const,
          mutation,
        };
      };

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

      if (config.showSuccessToast !== false) {
        toast.success(config.successMessage ?? `${getActionLabel(config)} completed.`);
      }
    },
    onError: async (error, variables, onMutateResult, mutationContext) => {
      await options.onError?.(error, variables, onMutateResult, mutationContext);

      if (config.showErrorToast !== false) {
        toast.error(getErrorMessage(error, config));
      }
    },
  });
}
