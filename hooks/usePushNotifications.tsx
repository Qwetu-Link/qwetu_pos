"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "@/components/notification-actions";
import { urlBase64ToUint8Array } from "@/utils/notifications";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Error registering service worker:", err);
      setError("Failed to register service worker");
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        return;
      }

      if (!isActive) {
        return;
      }

      setIsSupported(true);
      await registerServiceWorker();
    };

    void initialize();

    return () => {
      isActive = false;
    };
  }, [registerServiceWorker]);

  const subscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (Notification.permission === "denied") {
        throw new Error("Notifications are blocked. Enable in browser settings.");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      const registration = await navigator.serviceWorker.ready;

      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error("VAPID public key not configured");
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ),
      });

      const plainSub = JSON.parse(JSON.stringify(sub));
      const result = await subscribeToPush(plainSub);

      if (result.success) {
        setSubscription(sub);
        setIsSubscribed(true);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      if (err instanceof Error) {
        console.error("Subscription error:", err.name, err.message);
      } else {
        console.error("Error subscribing:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      if (subscription) {
        const plainSub = JSON.parse(JSON.stringify(subscription));
        await unsubscribeFromPush(plainSub);
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}

export function PushNotificationManager() {
  const { isSupported, isSubscribed, isLoading, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Push notifications</p>
          <p className="text-sm text-slate-600">
            {isSubscribed
              ? "You will receive order and stock alerts on this device."
              : "Enable alerts for new orders, payments, and low-stock events."}
          </p>
        </div>
        <button
          type="button"
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={isLoading}
          className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? "Working..." : isSubscribed ? "Disable alerts" : "Enable alerts"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
