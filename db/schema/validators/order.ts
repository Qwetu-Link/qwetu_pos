import z from "zod";

const installmentPlanSchema = z
    .string()
    .trim()
    .optional()
    .refine((value) => {
        if (!value) return true;
        const months = Number(value.match(/\d+/)?.[0]);
        return Number.isInteger(months) && months >= 1 && months <= 12;
    }, "Installment plan must be between 1 and 12 months");

export const orderLineItemSchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
    productId: z.string().trim().uuid("Invalid product"),
    sku: z.string().trim().min(1, "SKU is required"),
    name: z.string().trim().min(1, "Item name is required"),
    qty: z.number().int().min(1, "Quantity must be at least 1"),
    price: z.number().int().min(0, "Price cannot be negative"),
    originalPrice: z.number().int().min(0, "Original price cannot be negative"),
    locationName: z.enum(["Main Store", "Warehouse A", "Outlet"]),
});

export const orderCreateSchema = z.object({
    customerId: z.string().trim().uuid("Invalid customer"),
    paymentType: z.enum(["full", "installment"]),
    amountPaid: z.number().int().min(0, "Amount paid cannot be negative"),
    installmentPlan: installmentPlanSchema,
    installmentStartDate: z.string().trim().optional(),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    shippingAddress: z.string().trim(),
    lineItems: z.array(orderLineItemSchema).min(1, "Add at least one item"),
});

export const orderEditSchema = orderCreateSchema.extend({
    id: z.string().trim().uuid("Invalid order"),
});

export const orderIdSchema = z.object({
    id: z.string().trim().uuid("Invalid order"),
});

export const orderStatusSchema = z.object({
    id: z.string().trim().uuid("Invalid order"),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export const orderPaymentSchema = z.object({
    invoiceId: z.string().trim().uuid("Invalid invoice"),
    amount: z.number().int().positive("Amount must be greater than zero"),
    paymentDate: z.string().trim().min(1, "Payment date is required"),
    paymentMethod: z.enum(["M-Pesa", "Airtel Money", "Bank Transfer", "Cash", "Card"]),
    reference: z.string().trim().max(255, "Reference is too long").optional(),
    note: z.string().trim().max(500, "Note is too long").optional(),
});
