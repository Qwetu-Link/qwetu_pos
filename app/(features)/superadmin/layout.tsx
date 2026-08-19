import type { ReactNode } from "react";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect("/login");
  // }

  // if (session.user.roleName !== "Super Admin") {
  //   redirect("/dashboard");
  // }

  return (
    <div className="min-h-screen bg-emerald-50/60 text-slate-950">
      <main>
        {children}
      </main>
    </div>
  );
}
