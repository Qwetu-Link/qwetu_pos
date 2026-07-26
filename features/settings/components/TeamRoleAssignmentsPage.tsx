"use client";

import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { useState } from "react";
import {
  useCreateTeamUser,
  useDeleteTeamUser,
  useGetRoles,
  useGetTeamUsers,
  useUpdateTeamUser,
} from "@/hooks/useSettingsAccess";
import type { TeamUser } from "@/types/settings";
import AddTeamUserModal, { type TeamUserFormValues } from "./AddTeamUserModal";
import TeamAssignmentsSection from "./TeamAssignmentsSection";
import { AccessManagementSkeleton } from "@/components/skeletons";

export default function TeamRoleAssignmentsPage() {
  const { users, isLoading, isError, error } = useGetTeamUsers();
  const { roles } = useGetRoles();
  const createTeamUser = useCreateTeamUser();
  const updateTeamUser = useUpdateTeamUser();
  const deleteTeamUser = useDeleteTeamUser();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);

  async function addUser(user: TeamUserFormValues) {
    if (editingUser) {
      await updateTeamUser.mutateAsync({ id: editingUser.id, ...user });
    } else {
      await createTeamUser.mutateAsync(user);
    }
    setEditingUser(null);
    setIsUserOpen(false);
  }

  if (isLoading) {
    return <AccessManagementSkeleton kind="team" />;
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
            <UserCog className="h-8 w-8 text-emerald-600" />
            Team Role Assignments
          </h1>
          <p className="mt-1 text-slate-500">
            Review team access and assign each user to the correct business role.
          </p>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.message ?? "Could not load team users."}
        </div>
      ) : (
        <TeamAssignmentsSection
          roles={roles}
          users={users}
          onAddUser={() => {
            setEditingUser(null);
            setIsUserOpen(true);
          }}
          onEditUser={(user) => {
            setEditingUser(user);
            setIsUserOpen(true);
          }}
          onDeleteUser={(user) => deleteTeamUser.mutate({ id: user.id })}
        />
      )}

      <AddTeamUserModal
        isOpen={isUserOpen}
        onClose={() => {
          setEditingUser(null);
          setIsUserOpen(false);
        }}
        onAddUser={addUser}
        roles={roles}
        isSaving={createTeamUser.isPending || updateTeamUser.isPending}
        error={createTeamUser.isError ? createTeamUser.error.message : updateTeamUser.isError ? updateTeamUser.error.message : undefined}
        user={editingUser}
      />
    </div>
  );
}
