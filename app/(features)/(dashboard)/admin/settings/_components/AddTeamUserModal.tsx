import type { FormEvent } from "react";
import { UserPlus, X } from "lucide-react";
import { businessRoles } from "@/lib/pos-details-data";
import type { TeamUser } from "@/lib/pos-details-data";
import FormField from "./FormField";

export default function AddTeamUserModal({
  isOpen,
  onClose,
  onAddUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: TeamUser) => void;
}) {
  if (!isOpen) {
    return null;
  }

  function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const role = String(formData.get("role") || businessRoles[0]?.id || "owner");
    const status = String(formData.get("status") || "Invited");

    onAddUser({
      id: `U-${Date.now().toString().slice(-6)}`,
      name,
      email,
      role,
      status,
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
        <form onSubmit={submitUser} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FormField label="Full Name" name="name" placeholder="e.g. Jane Doe" required />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="jane@qwetulinks.co.ke"
            required
          />
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role
            </span>
            <select
              name="role"
              defaultValue={businessRoles[0]?.id}
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
              name="status"
              defaultValue="Invited"
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
