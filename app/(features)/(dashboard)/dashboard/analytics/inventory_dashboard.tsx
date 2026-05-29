import { dashboardData } from "@/data/dashboard-data";
import RoleDashboard from "../_components/RoleDashboard";

export default function InventoryDashboard() {
  return <RoleDashboard dashboard={dashboardData.inventory} />;
}
