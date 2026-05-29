"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { rolePermissionOptions } from "@/lib/pos-details-data";
import FormField from "./FormField";

const addRoleSchema = z.object({
  roleName: z.string().trim().min(1, "Role name is required"),
  roleDescription: z.string().trim(),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type AddRoleFormValues = z.infer<typeof addRoleSchema>;

export default function AddRoleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      roleName: "",
      roleDescription: "",
      permissions: rolePermissionOptions
        .filter((permission) => permission.key.includes("view"))
        .map((permission) => permission.key),
    },
  });

  if (!isOpen) {
    return null;
  }

  function submitRole() {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Add Role</h3>
            <p className="text-sm text-slate-500">
              Choose the permissions this role should have.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          className="space-y-4 p-6"
          onSubmit={handleSubmit(submitRole)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Role Name" placeholder="e.g. Manager" error={errors.roleName?.message} {...register("roleName")} />
            <FormField
              label="Description"
              placeholder="Short role summary"
              error={errors.roleDescription?.message}
              {...register("roleDescription")}
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Permissions
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rolePermissionOptions.map((permission) => (
                <label
                  key={permission.key}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    value={permission.key}
                    {...register("permissions")}
                    className="h-4 w-4 rounded text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{permission.label}</span>
                </label>
              ))}
            </div>
            {errors.permissions ? (
              <p className="mt-2 text-xs text-red-500">{errors.permissions.message}</p>
            ) : null}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border text-black border-slate-300 px-5 py-2.5 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
