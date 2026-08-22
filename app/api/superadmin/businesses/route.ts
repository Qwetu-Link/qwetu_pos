import { auth } from "@/auth";
import { getBusinesses } from "@/db/queries/business";
import { superAdminCreateBusiness } from "@/server/register-business";
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

  const businesses = await getBusinesses();
  return NextResponse.json({ data: businesses });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await superAdminCreateBusiness(data);
    if (!result.success) {
      const status = result.error.includes("Unauthorized") ? 401 : result.error.includes("Forbidden") ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create business";
    const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
