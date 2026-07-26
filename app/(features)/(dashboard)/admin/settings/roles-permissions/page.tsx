import type { Metadata } from "next";
import RolesPermissionsPage from "@/features/settings/components/RolesPermissionsPage";

export const metadata: Metadata = {
  title: "Roles & Permissions | QwetuLinks Clothing POS",
  description: "Create roles and configure POS permissions for each role.",
};

export default function Page() {
  return <RolesPermissionsPage />;
}
