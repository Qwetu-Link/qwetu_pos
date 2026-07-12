"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import AddRoleModal from "./AddRoleModal";
import RolesPermissionsSection from "./RolesPermissionsSection";

export default function RolesPermissionsPage() {
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link
            href="/admin/settings"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Settings
          </Link>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            Roles & Permissions
          </h1>
          <p className="mt-1 text-slate-500">
            Configure the access model for every business role in the POS.
          </p>
        </div>
      </div>

      <RolesPermissionsSection onAddRole={() => setIsRoleOpen(true)} />

      <AddRoleModal
        isOpen={isRoleOpen}
        onClose={() => setIsRoleOpen(false)}
      />
    </div>
  );
}
