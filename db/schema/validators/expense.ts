import z from "zod";
import { expenseCategoryValues } from "@/data/expense-categories";

export const expenseSchema = z.object({
    date: z.string().min(1, "Date is required"),
    category: z.enum(expenseCategoryValues),
    vendor: z.string().trim().min(1, "Vendor is required"),
    amount: z.number().int().min(0, "Amount cannot be negative").optional(),
    method: z.enum(["M-Pesa", "Cash", "Bank Transfer", "Card"]),
    status: z.enum(["pending", "approved", "rejected"]),
    note: z.string().trim().max(500, "Note is too long").optional(),
    items: z.array(z.object({
        name: z.string().trim(),
        quantity: z.number().int().min(0),
        unitCost: z.number().int().min(0),
    })).optional(),
}).superRefine((values, ctx) => {
    if (values.category === "inventory_purchase") {
        if (!values.items?.length) {
            ctx.addIssue({
                code: "custom",
                message: "Add at least one expense item",
                path: ["items"],
            });
        }
        values.items?.forEach((item, index) => {
            if (!item.name) {
                ctx.addIssue({
                    code: "custom",
                    message: "Item name is required",
                    path: ["items", index, "name"],
                });
            }
            if (item.quantity < 1) {
                ctx.addIssue({
                    code: "custom",
                    message: "Quantity must be at least 1",
                    path: ["items", index, "quantity"],
                });
            }
            if (item.unitCost <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Unit cost must be greater than zero",
                    path: ["items", index, "unitCost"],
                });
            }
        });
        return;
    }

    if (!values.amount || values.amount <= 0) {
        ctx.addIssue({
            code: "custom",
            message: "Amount must be greater than zero",
            path: ["amount"],
        });
    }
});

export const expenseCreateSchema = expenseSchema;

export const expenseEditSchema = expenseSchema.extend({
    id: z.string().trim().uuid("Invalid expense"),
});

export const expenseIdSchema = z.object({
    id: z.string().trim().uuid("Invalid expense"),
});

export const expenseStatusSchema = expenseIdSchema.extend({
    status: z.enum(["pending", "approved", "rejected"]),
});
