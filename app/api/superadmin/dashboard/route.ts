import { auth } from "@/auth";
import { getSuperAdminDashboardData } from "@/db/queries/superadmin-dashboard";
import { NextResponse } from "next/server";

type SuperAdminSession = {
  user?: {
    roleName?: string;
    businessId?: string | null;
  };
} | null;

function isSuperAdmin(session: SuperAdminSession) {
  return session?.user?.roleName === "SUPERADMIN" || session?.user?.businessId === null;
}

export async function GET() {
  const session = await auth();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getSuperAdminDashboardData();
  return NextResponse.json({ data });
}
