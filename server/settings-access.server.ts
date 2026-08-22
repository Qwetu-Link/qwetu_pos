import {
    createRoleQuery,
    createTeamUserQuery,
    deleteRoleQuery,
    deleteTeamUserQuery,
    getRolesQuery,
    getTeamUsersQuery,
    updateRoleQuery,
    updateTeamUserQuery,
} from "@/db/queries/settings-access";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    roleCreateSchema,
    roleEditSchema,
    roleIdSchema,
    teamUserCreateSchema,
    teamUserEditSchema,
    teamUserIdSchema,
} from "@/db/schema/validators/settings-access";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage settings access.",
        });
    }

    return businessId;
}

function ensureRecord<T>(record: T | undefined, message: string) {
    if (!record) {
        throw new TRPCError({ code: "NOT_FOUND", message });
    }

    return record;
}

export const settingsAccessRouter = createTRPCRouter({
    getRoles: baseProcedure.query(async ({ ctx }) => {
        return getRolesQuery(ensureBusinessId(ctx.businessId));
    }),

    addRole: baseProcedure
        .input(roleCreateSchema)
        .mutation(async ({ input, ctx }) => {
            return createRoleQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });
        }),

    editRole: baseProcedure
        .input(roleEditSchema)
        .mutation(async ({ input, ctx }) => {
            const role = await updateRoleQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureRecord(role, "Role not found for this business.");
        }),

    removeRole: baseProcedure
        .input(roleIdSchema)
        .mutation(async ({ input, ctx }) => {
            const role = await deleteRoleQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureRecord(role, "Role not found for this business.");
        }),

    getTeamUsers: baseProcedure.query(async ({ ctx }) => {
        return getTeamUsersQuery(ensureBusinessId(ctx.businessId));
    }),

    addTeamUser: baseProcedure
        .input(teamUserCreateSchema)
        .mutation(async ({ input, ctx }) => {
            return createTeamUserQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });
        }),

    editTeamUser: baseProcedure
        .input(teamUserEditSchema)
        .mutation(async ({ input, ctx }) => {
            const user = await updateTeamUserQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureRecord(user, "Team user not found for this business.");
        }),

    removeTeamUser: baseProcedure
        .input(teamUserIdSchema)
        .mutation(async ({ input, ctx }) => {
            const user = await deleteTeamUserQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureRecord(user, "Team user not found for this business.");
        }),
});
