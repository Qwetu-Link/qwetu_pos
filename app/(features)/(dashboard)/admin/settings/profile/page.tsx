import type { Metadata } from "next";
import ProfileDetailsPage from "@/features/settings/components/ProfileDetailsPage";

export const metadata: Metadata = {
  title: "Business Profile | QwetuLinks Clothing POS",
  description: "View and edit business profile details.",
};

export default function Page() {
  return <ProfileDetailsPage />;
}
