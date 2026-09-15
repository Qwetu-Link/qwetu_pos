import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getNotificationPreferencesQuery } from "@/db/queries/notifications";
import SettingsDetails from "@/features/settings/components/SettingsDetails";

export const metadata: Metadata = {
  title: "Settings | QwetuLinks Clothing POS",
  description: "Configure clothing store profile, team roles, billing, and permissions.",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const notificationPreferences = await getNotificationPreferencesQuery(session.user.businessId);

  return <SettingsDetails notificationPreferences={notificationPreferences} />;
}

