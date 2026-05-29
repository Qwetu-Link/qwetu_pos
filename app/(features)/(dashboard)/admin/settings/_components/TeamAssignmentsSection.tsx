import { Plus, Users } from "lucide-react";
import { businessRoles } from "@/lib/pos-details-data";
import type { TeamUser } from "@/lib/pos-details-data";
import SectionCard from "./SectionCard";

export default function TeamAssignmentsSection({
  users,
  onAddUser,
}: {
  users: TeamUser[];
  onAddUser: () => void;
}) {
  const roleLabels = new Map(businessRoles.map((role) => [role.id, role.name]));

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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3">User</th>
              <th className="py-3">Email</th>
              <th className="py-3">Role</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-4 font-medium text-slate-900">{user.name}</td>
                <td className="py-4 text-slate-500">{user.email}</td>
                <td className="py-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {roleLabels.get(user.role) ?? user.role}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
