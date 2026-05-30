import type { Metadata } from "next";
import SettingsDetails from "./_components/SettingsDetails";

export const metadata: Metadata = {
  title: "Settings | QwetuLinks Clothing POS",
  description: "Configure clothing store profile, team roles, billing, and WhatsApp settings.",
};

export default function Page() {
  return <SettingsDetails />;
}

