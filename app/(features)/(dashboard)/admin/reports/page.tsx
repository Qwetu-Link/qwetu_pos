import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminReportCenterData } from "@/db/queries/admin-reports";
import ReportsPage from "@/features/reports/components/ReportsPage";

export const metadata: Metadata = {
  title: "Reports | QwetuLinks Clothing POS",
  description: "Generate clothing store sales, inventory, customer, and collection reports.",
};

export default async function ReportPage() {
  const session = await auth();

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const data = await getAdminReportCenterData(session.user.businessId);

  return <ReportsPage data={data} />;
}
