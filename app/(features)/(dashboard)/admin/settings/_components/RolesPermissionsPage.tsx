"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useCreateRole, useDeleteRole, useGetRoles } from "@/hooks/useSettingsAccess";
import { useUpdateRole } from "@/hooks/useSettingsAccess";
import type { BusinessRole } from "@/types/settings";
import AddRoleModal, { type AddRoleFormValues } from "./AddRoleModal";
import RolesPermissionsSection from "./RolesPermissionsSection";

export default function RolesPermissionsPage() {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<BusinessRole | null>(null);
  const { roles, isLoading, isError, error } = useGetRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  async function saveRole(values: AddRoleFormValues) {
    const payload = {
      name: values.roleName,
      description: values.roleDescription,
      permissions: values.permissions,
    };
    if (editingRole) {
      await updateRole.mutateAsync({ id: editingRole.id, ...payload });
    } else {
      await createRole.mutateAsync(payload);
    }
    setEditingRole(null);
    setIsRoleOpen(false);
  }

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

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.message ?? "Could not load roles."}
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading roles...
        </div>
      ) : (
        <RolesPermissionsSection
          roles={roles}
          onAddRole={() => {
            setEditingRole(null);
            setIsRoleOpen(true);
          }}
          onEditRole={(role) => {
            setEditingRole(role);
            setIsRoleOpen(true);
          }}
          onDeleteRole={(role) => deleteRole.mutate({ id: role.id })}
        />
      )}

      <AddRoleModal
        isOpen={isRoleOpen}
        onClose={() => {
          setEditingRole(null);
          setIsRoleOpen(false);
        }}
        onSave={saveRole}
        isSaving={createRole.isPending || updateRole.isPending}
        error={createRole.isError ? createRole.error.message : updateRole.isError ? updateRole.error.message : undefined}
        role={editingRole}
      />
    </div>
  );
}
