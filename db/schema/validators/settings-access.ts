import z from "zod";

export const roleCreateSchema = z.object({
    name: z.string().trim().min(1, "Role name is required"),
    description: z.string().trim().optional(),
    salary: z.number().int().min(0).optional(),
    permissions: z.array(z.string().trim().min(1)).min(1, "Select at least one permission"),
});

export const roleEditSchema = roleCreateSchema.extend({
    id: z.string().trim().uuid("Invalid role"),
});

export const roleIdSchema = z.object({
    id: z.string().trim().uuid("Invalid role"),
});

export const teamUserCreateSchema = z.object({
    name: z.string().trim().min(1, "Full name is required"),
    email: z.email("Enter a valid email address").trim(),
    roleId: z.string().trim().uuid("Role is required"),
    status: z.enum(["Invited", "Active"]),
});

export const teamUserEditSchema = teamUserCreateSchema.extend({
    id: z.string().trim().uuid("Invalid user"),
});

export const teamUserIdSchema = z.object({
    id: z.string().trim().uuid("Invalid user"),
});
