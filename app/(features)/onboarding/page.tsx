import { Metadata } from "next";
import FinOnboardingPage from "../_home/onboarding-page";

export const metadata: Metadata = {
  title: "Qwetulink Finance ERP",
  description:
    "Enterprise-grade financial management, accounting, and business ERP dashboard",
  generator: "Outside Of Time",
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/web-app-manifest-192x192.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function OnboardingPage() {
  return <FinOnboardingPage />;
}
