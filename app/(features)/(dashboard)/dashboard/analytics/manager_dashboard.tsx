import { dashboardData } from "@/data/dashboard-data";
import RoleDashboard from "../_components/RoleDashboard";

export default function ManagerDashboard() {
  return <RoleDashboard dashboard={dashboardData.manager} />;
}
