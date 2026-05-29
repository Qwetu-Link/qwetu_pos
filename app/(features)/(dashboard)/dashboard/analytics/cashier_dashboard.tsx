import { dashboardData } from "@/data/dashboard-data";
import RoleDashboard from "../_components/RoleDashboard";

export default function CashierDashboard() {
  return <RoleDashboard dashboard={dashboardData.cashier} />;
}
