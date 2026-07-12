import type { Metadata } from "next";
import TeamRoleAssignmentsPage from "../_components/TeamRoleAssignmentsPage";

export const metadata: Metadata = {
  title: "Team Role Assignments | QwetuLinks Clothing POS",
  description: "Assign team users to POS business roles and review access status.",
};

export default function Page() {
  return <TeamRoleAssignmentsPage />;
}
