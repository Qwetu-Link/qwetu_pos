"use client";

import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { useState } from "react";
import { teamUsers } from "@/utils/pos-details-data";
import type { TeamUser } from "@/utils/pos-details-data";
import AddTeamUserModal from "./AddTeamUserModal";
import TeamAssignmentsSection from "./TeamAssignmentsSection";

export default function TeamRoleAssignmentsPage() {
  const users = teamUsers;
  const [isUserOpen, setIsUserOpen] = useState(false);

  function addUser(user: TeamUser) {
    void user;
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

      <TeamAssignmentsSection
        users={users}
        onAddUser={() => setIsUserOpen(true)}
      />

      <AddTeamUserModal
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        onAddUser={addUser}
      />
    </div>
  );
}
