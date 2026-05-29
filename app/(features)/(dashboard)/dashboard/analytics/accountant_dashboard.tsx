import { dashboardData } from "@/data/dashboard-data";
import RoleDashboard from "../_components/RoleDashboard";

export default function AccountantDashboard() {
  return <RoleDashboard dashboard={dashboardData.accountant} />;
}
