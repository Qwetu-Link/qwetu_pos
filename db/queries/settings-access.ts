import { db } from "@/db";
import { roleTable } from "@/db/schema/roles";
import { permissionTable, rolePermissionTable, usersTable } from "@/db/schema/users";
import { rolePermissionOptions } from "@/utils/pos-details-data";
import type { BusinessRole, TeamUser } from "@/types/settings";
import { and, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

type RoleWriteInput = {
    id?: string;
    businessId: string;
    name: string;
    description?: string;
    salary?: number;
    permissions: string[];
};

type TeamUserWriteInput = {
    id?: string;
    businessId: string;
    name: string;
    email: string;
    roleId: string;
    status: "Invited" | "Active";
};

const permissionLabels = new Map(
    rolePermissionOptions.map((permission) => [permission.key, permission.label]),
);

function getPermissionGroup(permission: string) {
    return permission.split(".")[0] || "general";
}

async function ensurePermissions(permissionNames: string[]) {
    const uniqueNames = [...new Set(permissionNames)];
    if (uniqueNames.length === 0) return [];

    await db
        .insert(permissionTable)
        .values(uniqueNames.map((name) => ({
            name,
            description: permissionLabels.get(name) ?? name,
            group: getPermissionGroup(name),
        })))
        .onDuplicateKeyUpdate({
            set: { id: sql`${permissionTable.id}` },
        });

    return db
        .select()
        .from(permissionTable)
        .where(inArray(permissionTable.name, uniqueNames));
}

export async function getRolesQuery(businessId: string): Promise<BusinessRole[]> {
    const rows = await db
        .select({
            role: roleTable,
            permission: permissionTable,
        })
        .from(roleTable)
        .leftJoin(rolePermissionTable, eq(rolePermissionTable.roleId, roleTable.id))
        .leftJoin(permissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
        .where(eq(roleTable.businessId, businessId));

    const grouped = new Map<string, BusinessRole>();
    for (const row of rows) {
        const current = grouped.get(row.role.id) ?? {
            id: row.role.id,
            name: row.role.name,
            description: row.role.description ?? "",
            permissions: [],
        };
        if (row.permission?.name) current.permissions.push(row.permission.name);
        grouped.set(row.role.id, current);
    }

    return [...grouped.values()];
}

export async function createRoleQuery(data: RoleWriteInput) {
    const permissions = await ensurePermissions(data.permissions);
    const [role] = await db.transaction(async (tx) => {
        const id = randomUUID();
        await tx.insert(roleTable).values({
            id,
            businessId: data.businessId,
            name: data.name,
            description: data.description || null,
            salary: data.salary ?? 0,
        });

        const [role] = await tx
            .select()
            .from(roleTable)
            .where(eq(roleTable.id, id));

        if (permissions.length) {
            await tx.insert(rolePermissionTable).values(
                permissions.map((permission) => ({
                    roleId: role.id,
                    permissionId: permission.id,
                })),
            ).onDuplicateKeyUpdate({
                set: { roleId: sql`${rolePermissionTable.roleId}` },
            });
        }

        return [role];
    });

    return role;
}

export async function updateRoleQuery(data: RoleWriteInput & { id: string }) {
    const permissions = await ensurePermissions(data.permissions);

    const [role] = await db.transaction(async (tx) => {
        await tx.update(roleTable)
            .set({
                name: data.name,
                description: data.description || null,
                salary: data.salary ?? 0,
            })
            .where(and(
                eq(roleTable.id, data.id),
                eq(roleTable.businessId, data.businessId),
            ));

        const [role] = await tx
            .select()
            .from(roleTable)
            .where(and(
                eq(roleTable.id, data.id),
                eq(roleTable.businessId, data.businessId),
            ));

        if (!role) return [undefined];

        await tx.delete(rolePermissionTable)
            .where(eq(rolePermissionTable.roleId, data.id));

        if (permissions.length) {
            await tx.insert(rolePermissionTable).values(
                permissions.map((permission) => ({
                    roleId: data.id,
                    permissionId: permission.id,
                })),
            ).onDuplicateKeyUpdate({
                set: { roleId: sql`${rolePermissionTable.roleId}` },
            });
        }

        return [role];
    });

    return role;
}

export async function deleteRoleQuery(data: { id: string; businessId: string }) {
    const [role] = await db
        .select()
        .from(roleTable)
        .where(and(
            eq(roleTable.id, data.id),
            eq(roleTable.businessId, data.businessId),
        ));

    if (!role) return undefined;

    await db.delete(roleTable)
        .where(and(
            eq(roleTable.id, data.id),
            eq(roleTable.businessId, data.businessId),
        ));

    return role;
}

export async function getTeamUsersQuery(businessId: string): Promise<TeamUser[]> {
    const rows = await db
        .select({
            user: usersTable,
            role: roleTable,
        })
        .from(usersTable)
        .leftJoin(roleTable, eq(roleTable.id, usersTable.roleId))
        .where(eq(usersTable.businessId, businessId));

    return rows.map(({ user, role }) => ({
        id: user.id,
        name: user.name ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || user.email),
        email: user.email,
        role: role?.id ?? user.roleId ?? "",
        status: user.isActive ? "Active" : "Invited",
    }));
}

export async function createTeamUserQuery(data: TeamUserWriteInput) {
    const id = randomUUID();
    await db.insert(usersTable).values({
        id,
        businessId: data.businessId,
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        isActive: data.status === "Active",
    });

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

    return user;
}

export async function updateTeamUserQuery(data: TeamUserWriteInput & { id: string }) {
    await db.update(usersTable)
        .set({
            name: data.name,
            email: data.email,
            roleId: data.roleId,
            isActive: data.status === "Active",
        })
        .where(and(
            eq(usersTable.id, data.id),
            eq(usersTable.businessId, data.businessId),
        ));

    const [user] = await db
        .select()
        .from(usersTable)
        .where(and(
            eq(usersTable.id, data.id),
            eq(usersTable.businessId, data.businessId),
        ));

    return user;
}

export async function deleteTeamUserQuery(data: { id: string; businessId: string }) {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(and(
            eq(usersTable.id, data.id),
            eq(usersTable.businessId, data.businessId),
        ));

    if (!user) return undefined;

    await db.delete(usersTable)
        .where(and(
            eq(usersTable.id, data.id),
            eq(usersTable.businessId, data.businessId),
        ));

    return user;
}
