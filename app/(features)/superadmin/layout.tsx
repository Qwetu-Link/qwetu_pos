import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SuperAdminSidebar from "@/features/superadmin/components/SuperAdminSidebar";

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.roleName !== "Super Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-emerald-50/60 text-slate-950">
      <SuperAdminSidebar />
      <div className="min-h-screen md:ml-[292px]">
        <main className="min-h-screen px-3 pb-8 pt-28 sm:px-5 md:pt-5 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
