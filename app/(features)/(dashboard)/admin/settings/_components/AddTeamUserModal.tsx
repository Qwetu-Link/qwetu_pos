"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { businessRoles } from "@/lib/pos-details-data";
import type { TeamUser } from "@/lib/pos-details-data";
import FormField from "./FormField";

const teamUserSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z.email("Enter a valid email address").trim(),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["Invited", "Active"]),
});

type TeamUserFormValues = z.infer<typeof teamUserSchema>;

function createTeamUserId() {
  return `U-${Date.now().toString().slice(-6)}`;
}

export default function AddTeamUserModal({
  isOpen,
  onClose,
  onAddUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: TeamUser) => void;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TeamUserFormValues>({
    resolver: zodResolver(teamUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: businessRoles[0]?.id || "owner",
      status: "Invited",
    },
  });

  if (!isOpen) {
    return null;
  }

  function submitUser(values: TeamUserFormValues) {
    onAddUser({
      id: createTeamUserId(),
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Add Team User</h3>
            <p className="text-sm text-slate-500">
              Invite a user and assign their business role.
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
        <form onSubmit={handleSubmit(submitUser)} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FormField label="Full Name" placeholder="e.g. Jane Doe" required error={errors.name?.message} {...register("name")} />
          <FormField
            label="Email"
            type="email"
            placeholder="jane@qwetulinks.co.ke"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role
            </span>
            <select
              {...register("role")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              {businessRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Status
            </span>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              <option value="Invited">Invited</option>
              <option value="Active">Active</option>
            </select>
          </label>
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border text-black border-slate-300 px-5 py-2.5 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
