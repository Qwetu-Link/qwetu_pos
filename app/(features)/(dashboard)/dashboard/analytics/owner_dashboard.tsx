import { dashboardData } from "@/data/dashboard-data";
import RoleDashboard from "../_components/RoleDashboard";

export default function AdminDashboard() {
  return <RoleDashboard dashboard={dashboardData.owner} />;
}
