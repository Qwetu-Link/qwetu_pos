import type { Metadata } from "next";
import SettingsDetails from "@/features/settings/components/SettingsDetails";

export const metadata: Metadata = {
  title: "Settings | QwetuLinks Clothing POS",
  description: "Configure clothing store profile, team roles, billing, and permissions.",
};

export default function Page() {
  return <SettingsDetails />;
}

