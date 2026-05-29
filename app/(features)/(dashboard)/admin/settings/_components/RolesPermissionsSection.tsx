import { Plus, ShieldCheck } from "lucide-react";
import { businessRoles } from "@/lib/pos-details-data";
import SectionCard from "./SectionCard";

export default function RolesPermissionsSection({
  onAddRole,
}: {
  onAddRole: () => void;
}) {
  return (
    <SectionCard>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Roles & Permissions
            </h2>
            <p className="text-sm text-slate-500">
              Control what each business role can access
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddRole}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {businessRoles.map((role) => (
          <div key={role.id} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{role.name}</h3>
                <p className="text-sm text-slate-500">{role.description}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {role.permissions.length} permissions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.slice(0, 6).map((permission) => (
                <span
                  key={permission}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                >
                  {permission}
                </span>
              ))}
              {role.permissions.length > 6 ? (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  +{role.permissions.length - 6} more
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
