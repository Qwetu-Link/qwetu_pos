import { Pencil, Plus, Trash2, Users } from "lucide-react";
import type { BusinessRole, TeamUser } from "@/types/admin/settings";
import { SimpleDataTable } from "@/components/datatables";
import SectionCard from "./SectionCard";

export default function TeamAssignmentsSection({
  roles,
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: {
  roles: BusinessRole[];
  users: TeamUser[];
  onAddUser: () => void;
  onEditUser: (user: TeamUser) => void;
  onDeleteUser: (user: TeamUser) => void;
}) {
  const roleLabels = new Map(roles.map((role) => [role.id, role.name]));

  return (
    <SectionCard>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Team Role Assignments
            </h2>
            <p className="text-sm text-slate-500">
              Assign team members to the correct business role
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddUser}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>
      <SimpleDataTable
        minWidth="min-w-[680px]"
        headers={[
          "User",
          "Email",
          "Role",
          "Status",
          { label: "Actions", className: "text-right" },
        ]}
        rows={users.map((user) => ({
          id: user.id,
          cells: [
            <span key="name" className="font-medium text-slate-900">{user.name}</span>,
            user.email,
            <span key="role" className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {roleLabels.get(user.role) ?? user.role}
            </span>,
            <span
              key="status"
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                user.status === "Active"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.status}
            </span>,
            <div key="actions" className="inline-flex w-full items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onEditUser(user)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteUser(user)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>,
          ],
        }))}
      />
    </SectionCard>
  );
}
