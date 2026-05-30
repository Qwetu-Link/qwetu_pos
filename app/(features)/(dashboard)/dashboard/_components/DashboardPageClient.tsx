"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/app/config/roles";
import AccountantDashboard from "../analytics/accountant_dashboard";
import CashierDashboard from "../analytics/cashier_dashboard";
import ManagerDashboard from "../analytics/manager_dashboard";
import AdminDashboard from "../analytics/owner_dashboard";
import InventoryDashboard from "../analytics/inventory_dashboard";

const DASHBOARD_MAP: Record<UserRole, () => JSX.Element> = {
  Owner: () => <AdminDashboard />,
  Manager: () => <ManagerDashboard />,
  Cashier: () => <CashierDashboard />,
  Accountant: () => <AccountantDashboard />,
  Inventory: () => <InventoryDashboard />,
};

export default function DashboardPageClient() {
  const router = useRouter();
  const user: UserRole = "Owner";

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const DashboardComponent = DASHBOARD_MAP[user];

  if (!DashboardComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium">
            Unknown role: <code>{user}</code>
          </p>
          <p className="text-sm text-red-400 mt-1">Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      <DashboardComponent />
    </div>
  );
}
