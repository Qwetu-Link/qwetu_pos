import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBusinessProfileById } from "@/db/queries/business";
import ProfileDetailsPage from "@/features/settings/components/ProfileDetailsPage";

export const metadata: Metadata = {
  title: "Business Profile | QwetuLinks Clothing POS",
  description: "View and edit business profile details.",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const profile = await getBusinessProfileById(session.user.businessId);

  if (!profile) {
    redirect("/admin/settings");
  }

  return <ProfileDetailsPage profile={profile} />;
}
