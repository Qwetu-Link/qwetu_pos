import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminDashboardShell from "@/features/dashboard/components/AdminDashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.roleName === "SUPERADMIN") {
    redirect("/superadmin");
  }

  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
