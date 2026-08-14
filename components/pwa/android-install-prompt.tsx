"use client";

import { useEffect, useState } from "react";
import { Download, MoreVertical, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as NavigatorWithStandalone).standalone === true
  );
}

function isAndroidChrome() {
  const ua = navigator.userAgent;

  return (
    /Android/i.test(ua) &&
    /Chrome/i.test(ua) &&
    !/EdgA|OPR|SamsungBrowser|Firefox/i.test(ua)
  );
}

export default function AndroidInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);
  const [showFallbackHelp, setShowFallbackHelp] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const updateDisplayMode = () => {
      setIsStandalone(isStandaloneMode());
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowFallbackHelp(false);
      setIsDismissed(false);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsDismissed(true);
      setShowFallbackHelp(false);
      setIsStandalone(true);
    };

    updateDisplayMode();
    setIsSupportedBrowser(isAndroidChrome());

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const displayModeQuery = window.matchMedia("(display-mode: standalone)");
    displayModeQuery.addEventListener("change", updateDisplayMode);

    const fallbackTimer = window.setTimeout(() => {
      if (isAndroidChrome() && !isStandaloneMode()) {
        setShowFallbackHelp(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      displayModeQuery.removeEventListener("change", updateDisplayMode);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (isStandalone || isDismissed || !isSupportedBrowser) {
    return null;
  }

  if (!deferredPrompt && !showFallbackHelp) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Download className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Install QwetuLinks</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Add the POS app to your phone for a faster standalone experience.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Dismiss install prompt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {deferredPrompt ? (
              <button
                type="button"
                onClick={installApp}
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Install app
              </button>
            ) : (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                <MoreVertical className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  If the button does not appear, open Chrome menu and tap
                  <span className="font-semibold"> Install app</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
