import z from "zod";

export const customerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Enter a valid email address").trim().or(z.literal("")),
    phone: z.string().trim().min(1, "Phone is required"),
    address: z.string().trim(),
    segment: z.enum(["New", "Regular", "VIP"]),
    riskLevel: z.enum(["low", "medium", "high"]),
});

export const customerEditSchema = customerSchema.extend({
    id: z.string().trim().uuid("Invalid customer"),
});

export const customerIdSchema = z.object({
    id: z.string().trim().uuid("Invalid customer"),
});
